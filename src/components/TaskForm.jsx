import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function TaskForm({ task, categories, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    category_id: '',
  });
  const [saving, setSaving] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        due_date: task.due_date || '',
        category_id: task.category_id || '',
      });
    }
    // Focus title input
    setTimeout(() => titleRef.current?.focus(), 100);
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        ...formData,
        category_id: formData.category_id || null,
        due_date: formData.due_date || null,
      });
      onClose();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e);
  };

  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{task ? 'Edit Task' : 'New Task'}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              ref={titleRef}
              type="text"
              name="title"
              className="form-input"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              className="form-input"
              placeholder="Add a description..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select
                name="priority"
                className="form-input"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                name="due_date"
                className="form-input"
                value={formData.due_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category_id"
              className="form-input"
              value={formData.category_id}
              onChange={handleChange}
            >
              <option value="">No category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <span className="kbd-hint" style={{ marginRight: 'auto' }}>
              <span className="kbd">⌘</span>+<span className="kbd">↵</span> to save
            </span>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving || !formData.title.trim()}>
              {saving ? 'Saving...' : task ? 'Update' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
