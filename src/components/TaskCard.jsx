import { Check, Pencil, Trash2, Calendar, GripVertical } from 'lucide-react';

export default function TaskCard({ task, onToggle, onEdit, onDelete, dragHandleProps }) {
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = task.due_date && task.due_date < today && !task.completed;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-card-header">
        <div {...(dragHandleProps || {})} style={{ cursor: 'grab', display: 'flex', alignItems: 'center', color: 'var(--text-tertiary)' }}>
          <GripVertical size={16} />
        </div>

        <div
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
        >
          {task.completed && <Check size={14} />}
        </div>

        <div className="task-content" onClick={() => onEdit(task)}>
          <div className="task-title">{task.title}</div>
          {task.description && (
            <div className="task-description">{task.description}</div>
          )}
          <div className="task-meta">
            <span className={`task-badge priority-${task.priority}`}>
              {task.priority}
            </span>
            {task.due_date && (
              <span className={`task-badge ${isOverdue ? 'overdue' : 'date'}`}>
                <Calendar size={11} />
                {isOverdue ? 'Overdue · ' : ''}{formatDate(task.due_date)}
              </span>
            )}
            {task.categories && (
              <span className="task-badge category" style={{ borderLeft: `3px solid ${task.categories.color}` }}>
                {task.categories.name}
              </span>
            )}
          </div>
        </div>

        <div className="task-actions">
          <button className="task-action-btn" onClick={() => onEdit(task)} title="Edit">
            <Pencil size={15} />
          </button>
          <button className="task-action-btn delete" onClick={() => onDelete(task.id)} title="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
