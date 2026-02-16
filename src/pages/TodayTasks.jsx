import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Sun } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import SearchBar from '../components/SearchBar';

export default function TodayTasks() {
  const {
    tasks, categories, loading, filter, setFilter,
    addTask, updateTask, deleteTask, toggleComplete, reorderTasks,
  } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    setFilter(prev => ({ ...prev, view: 'today' }));
  }, [setFilter]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); setShowForm(true); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSave = async (data) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      const today = new Date().toISOString().split('T')[0];
      await addTask({ ...data, due_date: data.due_date || today });
    }
  };

  const handleEdit = (task) => { setEditingTask(task); setShowForm(true); };
  const handleClose = () => { setShowForm(false); setEditingTask(null); };
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    reorderTasks(result.source.index, result.destination.index);
  };

  const today = new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <>
      <div className="page-header">
        <h2><Sun size={24} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: 8, color: 'var(--warning)' }} />Today</h2>
        <p>{today}</p>
      </div>

      <SearchBar filter={filter} setFilter={setFilter} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌅</div>
          <h3>No tasks for today</h3>
          <p>Enjoy your free time or add some tasks!</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="today-tasks">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <TaskCard task={task} onToggle={toggleComplete} onEdit={handleEdit} onDelete={deleteTask} dragHandleProps={provided.dragHandleProps} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <button className="fab" onClick={() => setShowForm(true)} title="Add task (N)"><Plus /></button>

      {showForm && (
        <TaskForm task={editingTask} categories={categories} onSave={handleSave} onClose={handleClose} />
      )}
    </>
  );
}
