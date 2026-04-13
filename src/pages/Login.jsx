// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/components/SafeIcon';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signup(email, password, name);
        toast('Account created! Please check your email to confirm.', 'success');
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (error) {
      toast(error.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-900 flex flex-col h-full px-8 py-8">
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 bg-brand-500 rounded-3xl flex items-center justify-center mb-4 shadow-xl">
          <SafeIcon icon={FiIcons.FiBriefcase} className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Tulia Tag</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mt-1">Your bag. Your code. Your control.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex-1">
        {isSignUp && (
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
            <input
              type="text"
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block">Email Address</label>
          <input
            type="email"
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block">Password</label>
          <input
            type="password"
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-2xl py-4 font-semibold text-lg shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <div className="mt-auto pt-6">
        <Link to="/forgot-password" className="block text-center text-brand-500 text-sm mb-6 hover:underline">
          Forgot your password?
        </Link>

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-brand-500 text-sm mb-8 hover:underline"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}