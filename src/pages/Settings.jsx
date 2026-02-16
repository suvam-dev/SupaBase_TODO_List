import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useTasks } from '../hooks/useTasks';
import { Sun, Moon, Plus, X, Palette } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { categories, addCategory, deleteCategory } = useTasks();
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#6366f1');

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      await addCategory(newCatName.trim(), newCatColor);
      setNewCatName('');
      setNewCatColor('#6366f1');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Settings</h2>
        <p>Manage your preferences</p>
      </div>

      {/* Profile */}
      <div className="settings-section">
        <h3>Profile</h3>
        <div className="settings-row">
          <div>
            <div className="label">Email</div>
            <div className="sublabel">{user?.email}</div>
          </div>
        </div>
        <div className="settings-row">
          <div>
            <div className="label">User ID</div>
            <div className="sublabel" style={{ fontSize: 11, fontFamily: 'monospace' }}>{user?.id}</div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="settings-section">
        <h3>Appearance</h3>
        <div className="settings-row">
          <div>
            <div className="label">Theme</div>
            <div className="sublabel">Switch between light and dark mode</div>
          </div>
          <button className="btn btn-secondary" onClick={toggleTheme} style={{ gap: 6 }}>
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="settings-section">
        <h3>Categories</h3>
        <div className="category-list">
          {categories.length === 0 && (
            <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>No categories yet</span>
          )}
          {categories.map(cat => (
            <div
              key={cat.id}
              className="category-chip"
              style={{ background: cat.color + '20', color: cat.color, borderLeft: `3px solid ${cat.color}` }}
            >
              {cat.name}
              <span className="delete-cat" onClick={() => deleteCategory(cat.id)}>
                <X size={12} />
              </span>
            </div>
          ))}
        </div>
        <div className="add-category-row">
          <input
            type="text"
            placeholder="Category name"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
          />
          <input
            type="color"
            value={newCatColor}
            onChange={e => setNewCatColor(e.target.value)}
            style={{ width: 40, height: 38, padding: 2, cursor: 'pointer', border: '1px solid var(--border-color)', borderRadius: 8 }}
          />
          <button className="btn btn-primary" onClick={handleAddCategory} style={{ padding: '8px 16px' }}>
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="settings-section">
        <h3>Keyboard Shortcuts</h3>
        <div className="settings-row">
          <div className="label">New Task</div>
          <div><span className="kbd">N</span></div>
        </div>
        <div className="settings-row">
          <div className="label">Save Task</div>
          <div><span className="kbd">⌘</span> + <span className="kbd">↵</span></div>
        </div>
        <div className="settings-row">
          <div className="label">Close Modal</div>
          <div><span className="kbd">Esc</span></div>
        </div>
      </div>
    </>
  );
}
