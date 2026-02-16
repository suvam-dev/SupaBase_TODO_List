import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import SearchBar from '../components/SearchBar';

export default function CompletedTasks() {
  const {
    tasks, loading, filter, setFilter,
    updateTask, deleteTask, toggleComplete,
  } = useTasks();

  useEffect(() => {
    setFilter(prev => ({ ...prev, view: 'completed' }));
  }, [setFilter]);

  const handleEdit = (task) => {
    // For completed tasks, just toggle back
  };

  return (
    <>
      <div className="page-header">
        <h2><CheckCircle2 size={24} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: 8, color: 'var(--success)' }} />Completed</h2>
        <p>{tasks.length} task{tasks.length !== 1 ? 's' : ''} completed</p>
      </div>

      <SearchBar filter={filter} setFilter={setFilter} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h3>No completed tasks</h3>
          <p>Complete some tasks and they'll appear here.</p>
        </div>
      ) : (
        <div>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleComplete}
              onEdit={handleEdit}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}
    </>
  );
}
