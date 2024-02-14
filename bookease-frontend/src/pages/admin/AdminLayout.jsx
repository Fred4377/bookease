import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'fas fa-chart-line' },
    { name: 'All Bookings', path: '/admin/bookings', icon: 'far fa-calendar-alt' },
    { name: 'Services', path: '/admin/services', icon: 'fas fa-briefcase' }
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] flex flex-col md:flex-row font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#161B22] border-r border-gray-800/80 sticky top-0 h-screen flex-shrink-0">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800/80">
          <Link to="/" className="flex items-center space-x-2 text-white font-extrabold text-lg">
            <span className="bg-gradient-to-r from-primary to-success text-transparent bg-clip-text">BookEase Admin</span>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-gray-800/40 flex items-center space-x-3 bg-[#0D1117]/35">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-primary font-bold text-sm">
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-white truncate">{user?.name || 'Administrator'}</h4>
            <p className="text-xs text-[#E6EDF3]/40 truncate">{user?.email || 'admin@bookease.com'}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/15'
                    : 'text-[#E6EDF3]/70 hover:bg-[#0D1117] hover:text-white'
                }`}
              >
                <i className={`${link.icon} w-5 mr-3 text-base`}></i>
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-gray-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-all border border-transparent hover:border-[#EF4444]/20"
          >
            <i className="fas fa-sign-out-alt w-5 mr-3 text-base"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* Header and Toggle for Mobile */}
      <div className="md:hidden bg-[#161B22] border-b border-gray-800/80 px-4 py-4 flex justify-between items-center z-30">
        <Link to="/" className="text-white font-extrabold text-lg tracking-tight">
          BookEase Admin
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-[#E6EDF3] hover:text-white p-2 focus:outline-none"
        >
          <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-[#0D1117]/95 z-20 pt-16 flex flex-col">
          <nav className="flex-1 px-6 py-8 space-y-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-4 py-4 rounded-xl text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/15'
                      : 'text-[#E6EDF3] hover:bg-gray-800'
                  }`}
                >
                  <i className={`${link.icon} w-6 mr-4 text-lg`}></i>
                  {link.name}
                </Link>
              );
            })}
            <button
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center px-4 py-4 rounded-xl text-base font-semibold text-[#EF4444] hover:bg-[#EF4444]/10 transition-all text-left"
            >
              <i className="fas fa-sign-out-alt w-6 mr-4 text-lg"></i>
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
