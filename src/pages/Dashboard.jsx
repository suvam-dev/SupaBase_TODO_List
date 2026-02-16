import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import SearchBar from '../components/SearchBar';
import ProgressBar from '../components/ProgressBar';
import AnalyticsWidget from '../components/AnalyticsWidget';
import PomodoroTimer from '../components/PomodoroTimer';

export default function Dashboard() {
  const {
    tasks, allTasks, categories, loading, filter, setFilter,
    addTask, updateTask, deleteTask, toggleComplete, reorderTasks, addCategory, analytics,
  } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Set view to 'all' for dashboard
  useEffect(() => {
    setFilter(prev => ({ ...prev, view: 'all' }));
  }, [setFilter]);

  // Keyboard shortcut: N to create new task
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setShowForm(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSave = async (data) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await addTask(data);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    reorderTasks(result.source.index, result.destination.index);
  };

  return (
    <>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Welcome back! Here's your task overview.</p>
      </div>

      <AnalyticsWidget analytics={analytics} />

      <PomodoroTimer />

      <ProgressBar
        completed={analytics.completedTasks}
        total={analytics.totalTasks}
      />

      <SearchBar filter={filter} setFilter={setFilter} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No tasks yet</h3>
          <p>Press <span className="kbd">N</span> or tap the + button to create your first task.</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={snapshot.isDragging ? 'dragging' : ''}
                      >
                        <TaskCard
                          task={task}
                          onToggle={toggleComplete}
                          onEdit={handleEdit}
                          onDelete={deleteTask}
                          dragHandleProps={provided.dragHandleProps}
                        />
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

      {/* Floating Add Button */}
      <button className="fab" onClick={() => setShowForm(true)} title="Add task (N)">
        <Plus />
      </button>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          categories={categories}
          onSave={handleSave}
          onClose={handleClose}
          onAddCategory={addCategory}
        />
      )}
    </>
  );
}
