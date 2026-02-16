import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ search: '', priority: '', view: 'all' });
  const debounceTimers = useRef({});

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*, categories(id, name, color)')
      .eq('user_id', user.id)
      .order('position', { ascending: true });

    if (!error) setTasks(data || []);
    setLoading(false);
  }, [user]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name');

    if (!error) setCategories(data || []);
  }, [user]);

  // Initial load
  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, [fetchTasks, fetchCategories]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('tasks-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        switch (payload.eventType) {
          case 'INSERT':
            setTasks(prev => {
              if (prev.find(t => t.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
            break;
          case 'UPDATE':
            setTasks(prev => prev.map(t => t.id === payload.new.id ? { ...t, ...payload.new } : t));
            break;
          case 'DELETE':
            setTasks(prev => prev.filter(t => t.id !== payload.old.id));
            break;
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Add task
  const addTask = async (taskData) => {
    if (!user) return;
    const maxPos = tasks.length > 0 ? Math.max(...tasks.map(t => t.position)) + 1 : 0;
    const newTask = {
      ...taskData,
      user_id: user.id,
      position: maxPos,
      completed: false,
    };

    // Optimistic
    const tempId = crypto.randomUUID();
    const optimistic = { ...newTask, id: tempId, created_at: new Date().toISOString() };
    setTasks(prev => [...prev, optimistic]);

    const { data, error } = await supabase.from('tasks').insert(newTask).select().single();
    if (error) {
      setTasks(prev => prev.filter(t => t.id !== tempId));
      throw error;
    }
    setTasks(prev => prev.map(t => t.id === tempId ? data : t));
    return data;
  };

  // Update task (with debounced auto-save)
  const updateTask = async (id, updates) => {
    // Optimistic
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

    // Debounce
    if (debounceTimers.current[id]) clearTimeout(debounceTimers.current[id]);
    return new Promise((resolve, reject) => {
      debounceTimers.current[id] = setTimeout(async () => {
        const { data, error } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (error) {
          fetchTasks(); // Revert on failure
          reject(error);
        } else {
          resolve(data);
        }
      }, 500);
    });
  };

  // Delete task
  const deleteTask = async (id) => {
    // Optimistic
    const prev = tasks;
    setTasks(tasks.filter(t => t.id !== id));

    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      setTasks(prev);
      throw error;
    }
  };

  // Toggle complete
  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    await updateTask(id, { completed: !task.completed });
  };

  // Reorder tasks (drag and drop)
  const reorderTasks = async (startIndex, endIndex) => {
    const result = Array.from(filteredTasks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    const updated = result.map((task, idx) => ({ ...task, position: idx }));
    setTasks(prev => {
      const ids = new Set(updated.map(t => t.id));
      const unchanged = prev.filter(t => !ids.has(t.id));
      return [...unchanged, ...updated];
    });

    // Batch update positions
    const updates = updated.map(t =>
      supabase.from('tasks').update({ position: t.position }).eq('id', t.id)
    );
    await Promise.all(updates);
  };

  // Add category
  const addCategory = async (name, color = '#6366f1') => {
    if (!user) return;
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, color, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    setCategories(prev => [...prev, data]);
    return data;
  };

  // Delete category
  const deleteCategory = async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Smart filtering & sorting
  const filteredTasks = tasks
    .filter(t => {
      if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
      if (filter.priority && t.priority !== filter.priority) return false;

      const today = new Date().toISOString().split('T')[0];
      if (filter.view === 'today') return t.due_date === today && !t.completed;
      if (filter.view === 'upcoming') return t.due_date > today && !t.completed;
      if (filter.view === 'completed') return t.completed;
      if (filter.view === 'all') return !t.completed;
      return true;
    })
    .sort((a, b) => {
      // Overdue first
      const today = new Date().toISOString().split('T')[0];
      const aOverdue = a.due_date && a.due_date < today && !a.completed ? 1 : 0;
      const bOverdue = b.due_date && b.due_date < today && !b.completed ? 1 : 0;
      if (bOverdue !== aOverdue) return bOverdue - aOverdue;

      // Then by priority
      const prio = { high: 3, medium: 2, low: 1 };
      if (prio[b.priority] !== prio[a.priority]) return prio[b.priority] - prio[a.priority];

      // Then by position
      return a.position - b.position;
    });

  // Analytics
  const analytics = {
    completedToday: tasks.filter(t => {
      if (!t.completed_at) return false;
      const today = new Date().toISOString().split('T')[0];
      return t.completed_at.startsWith(today);
    }).length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
    weeklyData: (() => {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en', { weekday: 'short' });
        const count = tasks.filter(t => t.completed_at && t.completed_at.startsWith(dateStr)).length;
        days.push({ day: dayName, completed: count });
      }
      return days;
    })(),
  };

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    categories,
    loading,
    filter,
    setFilter,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    reorderTasks,
    addCategory,
    deleteCategory,
    analytics,
    refetch: fetchTasks,
  };
}
