import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(email, password);

    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.error || 'Invalid credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0D1117] min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#161B22] border border-gray-800/60 p-8 rounded-3xl shadow-2xl relative">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 text-primary rounded-2xl mb-4 border border-primary/20 text-2xl shadow-inner">
            <i className="far fa-calendar-check"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-white">BookEase</h2>
          <p className="mt-2 text-sm text-[#E6EDF3]/60">
            Admin Management Login
          </p>
        </div>

        {error && (
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] px-4 py-3 rounded-xl text-sm flex items-center">
            <i className="fas fa-exclamation-circle mr-2 text-base"></i>
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-semibold text-[#E6EDF3]/80 mb-1">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bookease.com"
                className="w-full bg-[#0D1117] border border-gray-800 rounded-xl px-4 py-3 text-sm text-[#E6EDF3] placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#E6EDF3]/80 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0D1117] border border-gray-800 rounded-xl px-4 py-3 text-sm text-[#E6EDF3] placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 active:scale-98 shadow-lg shadow-primary/15"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <i className="fas fa-sign-in-alt ml-2"></i>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
