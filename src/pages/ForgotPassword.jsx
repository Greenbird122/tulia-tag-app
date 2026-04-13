// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from '../components/Toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    if (!email) {
      toast('Please enter your email', 'error');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setIsSent(true);
      toast('Password reset link sent! Check your email.', 'success');
    } catch (error) {
      toast(error.message || 'Failed to send reset link', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="flex-1 bg-white dark:bg-gray-900 flex flex-col justify-center px-8 relative h-full text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          We've sent a password reset link to <strong>{email}</strong>.
        </p>
        <Link 
          to="/login" 
          className="text-brand-500 font-medium hover:underline"
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">We'll send you a link to reset your password.</p>
      </div>

      <form onSubmit={handleResetRequest} className="mt-32 space-y-5">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block">Email Address</label>
          <input
            type="email"
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-500 text-white rounded-xl py-4 font-semibold text-sm shadow-lg shadow-brand-500/30 hover:bg-brand-600 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <Link 
          to="/login" 
          className="block text-center text-brand-500 text-sm font-medium hover:underline"
        >
          Back to Login
        </Link>
      </form>
    </div>
  );
}