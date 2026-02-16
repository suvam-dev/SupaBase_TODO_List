import { useState, useEffect, useRef } from 'react';
import { X, Plus, Check } from 'lucide-react';

export default function TaskForm({ task, categories, onSave, onClose, onAddCategory }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    category_id: '',
  });
  const [saving, setSaving] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const titleRef = useRef(null);
  const newCatInputRef = useRef(null);

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

  useEffect(() => {
    if (isAddingCategory) {
      setTimeout(() => newCatInputRef.current?.focus(), 100);
    }
  }, [isAddingCategory]);

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
    if (e.key === 'Escape') {
        if (isAddingCategory) {
            setIsAddingCategory(false);
        } else {
            onClose();
        }
    }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e);
  };

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim() || !onAddCategory) return;
    try {
      const newCat = await onAddCategory(newCategoryName.trim());
      if (newCat) {
        setFormData(prev => ({ ...prev, category_id: newCat.id }));
        setIsAddingCategory(false);
        setNewCategoryName('');
      }
    } catch (err) {
      console.error('Failed to add category:', err);
    }
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
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Category
              {!isAddingCategory && onAddCategory && (
                <button
                  type="button"
                  className="btn-text"
                  onClick={() => setIsAddingCategory(true)}
                  style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Plus size={12} /> New Category
                </button>
              )}
            </label>
            
            {isAddingCategory ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  ref={newCatInputRef}
                  type="text"
                  className="form-input"
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveCategory();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveCategory}
                  disabled={!newCategoryName.trim()}
                  style={{ padding: '0 12px' }}
                >
                  <Check size={16} />
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddingCategory(false)}
                  style={{ padding: '0 12px' }}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
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
            )}
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
