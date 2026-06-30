import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/logo.png";

const navItems = [
  { icon: '📊', label: 'Dashboard', path: '/' },
  { icon: '👥', label: 'Employees', path: '/employees' },
  { icon: '🕒', label: 'Attendance', path: '/attendance' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="EMS Logo" className="logo" />
          <div>
            <h2>EMS</h2>
            <p>Employee Management</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <strong>{user?.username}</strong>
            {user?.role?.replace('ROLE_', '')}
          </div>

          <button
            className="btn btn-secondary"
            style={{ width: '100%' }}
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}