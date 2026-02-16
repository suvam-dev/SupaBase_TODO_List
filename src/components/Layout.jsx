import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Mobile header */}
      <div className="mobile-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="logo-icon" style={{ width: 30, height: 30, fontSize: 14, background: 'var(--accent-gradient)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>✓</div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>TaskFlow</span>
        </div>
        <div style={{ width: 40 }} />
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
