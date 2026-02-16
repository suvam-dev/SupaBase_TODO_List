import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import {
  LayoutDashboard,
  CalendarDays,
  CalendarClock,
  CheckCircle2,
  Settings,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/today', icon: CalendarDays, label: 'Today' },
    { to: '/upcoming', icon: CalendarClock, label: 'Upcoming' },
    { to: '/completed', icon: CheckCircle2, label: 'Completed' },
  ];

  const initial = user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">✓</div>
          <h1>TaskFlow</h1>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Menu</div>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
              end={item.to === '/'}
            >
              <item.icon />
              {item.label}
            </NavLink>
          ))}

          <div className="nav-section-title">Account</div>
          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Settings />
            Settings
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 8px' }}>
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="kbd-hint">
              <span className="kbd">N</span> new task
            </div>
          </div>
          <div className="sidebar-user">
            <div className="avatar">{initial}</div>
            <div className="user-info">
              <div className="user-name">{user?.email?.split('@')[0] || 'User'}</div>
              <div className="user-email">{user?.email || ''}</div>
            </div>
          </div>
          <button className="nav-link" onClick={signOut} style={{ color: 'var(--danger)', marginTop: 4 }}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
