// src/pages/UpdatePassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from '../components/Toast';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for error in URL (Supabase sometimes adds error params)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorCode = params.get('error_code');
    const errorDesc = params.get('error_description');

    if (errorCode === 'otp_expired' || errorCode === 'invalid_token') {
      setError({
        title: 'Link Expired or Invalid',
        message: 'The password reset link has expired or is invalid. Please request a new one.',
      });
    }
  }, [location]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      toast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast('Password updated successfully! Please log in.', 'success');
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      toast(error.message || 'Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex-1 bg-white dark:bg-gray-900 flex flex-col justify-center px-8 relative h-full text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{error.title}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{error.message}</p>
        <Link
          to="/forgot-password"
          className="block w-full bg-brand-500 text-white rounded-xl py-4 font-semibold text-sm shadow-lg"
        >
          Request New Link
        </Link>
        <Link
          to="/login"
          className="block text-brand-500 text-sm font-medium hover:underline mt-4"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white dark:bg-gray-900 flex flex-col justify-center px-8 relative h-full">
      <div className="absolute top-16 left-8">
        <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/30">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">New Password</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Create a strong new password.</p>
      </div>

      <form onSubmit={handleUpdatePassword} className="mt-32 space-y-5">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">New Password</label>
          <input
            type="password"
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <p className="text-xs text-gray-400 mt-1">At least 6 characters</p>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Confirm Password</label>
          <input
            type="password"
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-500 text-white rounded-xl py-4 font-semibold text-sm shadow-lg shadow-brand-500/30 hover:bg-brand-600 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}