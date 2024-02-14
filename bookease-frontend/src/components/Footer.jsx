import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0D1117] border-t border-gray-800/60 pt-12 pb-6 mt-16 text-[#E6EDF3]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Info */}
        <div className="space-y-3">
          <Link to="/" className="flex items-center space-x-2 text-white font-extrabold text-lg tracking-tight">
            <span className="bg-gradient-to-r from-primary to-success text-transparent bg-clip-text">BookEase</span>
            <i className="far fa-calendar-check text-primary"></i>
          </Link>
          <p className="text-sm">
            Professional appointment scheduling built for modern salons, clinics, gyms, coaches, and photographers.
          </p>
          <div className="text-xs text-[#E6EDF3]/40">
            &copy; {new Date().getFullYear()} BookEase Inc. All rights reserved.
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/book" className="hover:text-primary transition-colors">Book Appointment</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-primary transition-colors">Admin Login</Link>
            </li>
            <li>
              <a href="#services" className="hover:text-primary transition-colors">Services Directory</a>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <i className="fas fa-map-marker-alt w-5 text-primary"></i>
              <span>100 Booking Lane, Suite A, NY 10001</span>
            </li>
            <li className="flex items-center">
              <i className="fas fa-phone-alt w-5 text-primary"></i>
              <span>+1 (555) BOOK-EASE</span>
            </li>
            <li className="flex items-center">
              <i className="fas fa-envelope w-5 text-primary"></i>
              <span>support@bookease.com</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
