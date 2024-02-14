import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isHome = location.pathname === '/';

  const scrollToSection = (id) => {
    setMobileOpen(false);
    if (!isHome) {
      navigate(`/#${id}`);
      // Wait a tick for navigation to finish
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#0D1117]/85 backdrop-blur-md border-b border-gray-800/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white font-extrabold text-xl tracking-tight hover:opacity-90">
              <span className="bg-gradient-to-r from-primary to-success text-transparent bg-clip-text">BookEase</span>
              <i className="far fa-calendar-check text-primary"></i>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-[#E6EDF3] hover:text-primary text-sm font-medium transition-colors">Home</Link>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-[#E6EDF3] hover:text-primary text-sm font-medium transition-colors bg-transparent border-none cursor-pointer outline-none"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-[#E6EDF3] hover:text-primary text-sm font-medium transition-colors bg-transparent border-none cursor-pointer outline-none"
            >
              How It Works
            </button>
            <Link to="/book" className="bg-primary/15 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg text-sm font-semibold border border-primary/30 transition-all">
              Book Now
            </Link>

            <span className="w-[1px] h-5 bg-gray-800"></span>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/admin/dashboard" className="text-xs uppercase tracking-wider font-semibold text-success hover:underline">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[#EF4444] hover:bg-[#EF4444]/10 border border-[#EF4444]/20 hover:border-[#EF4444]/40 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                >
                  Logout <i className="fas fa-sign-out-alt ml-1"></i>
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-[#E6EDF3]/70 hover:text-white text-sm font-medium flex items-center transition-colors">
                Admin Panel <i className="fas fa-arrow-right ml-1.5 text-xs text-primary"></i>
              </Link>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-[#E6EDF3] hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0D1117] border-b border-gray-800/80 px-4 pt-2 pb-4 space-y-2">
          <Link 
            to="/" 
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-[#E6EDF3] hover:bg-gray-800 hover:text-white"
          >
            Home
          </Link>
          <button 
            onClick={() => scrollToSection('services')}
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-[#E6EDF3] hover:bg-gray-800 hover:text-white"
          >
            Services
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-[#E6EDF3] hover:bg-gray-800 hover:text-white"
          >
            How It Works
          </button>
          <Link 
            to="/book" 
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium bg-primary/15 text-primary text-center"
          >
            Book Now
          </Link>
          
          <div className="border-t border-gray-850 pt-2 my-2"></div>

          {user ? (
            <div className="space-y-1">
              <Link 
                to="/admin/dashboard" 
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-success"
              >
                Admin Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-[#EF4444]"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-[#E6EDF3]/70 hover:bg-gray-800 hover:text-white"
            >
              Admin Panel Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
