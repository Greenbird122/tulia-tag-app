// src/pages/Login.jsx
import { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

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
        toast('Account created! You can now log in.');
        setIsSignUp(false);
        // Clear form
        setName('');
        setEmail('');
        setPassword('');
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (error) {
      toast(error.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col justify-center px-8 relative h-full">
      {/* Brand Header */}
      <div className="absolute top-16 left-8">
        <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/30">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tulia Tag</h1>
        <p className="text-gray-500 text-sm">Your bag. Your code. Your control.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-32 space-y-5">
        {isSignUp && (
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
              Full Name
            </label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={isSignUp}
            />
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
            Email Address
          </label>
          <input
            type="email"
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
            Password
          </label>
          <input
            type="password"
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {isSignUp && (
            <p className="text-xs text-gray-400 mt-1">At least 6 characters</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-500 text-white rounded-xl py-4 font-semibold text-sm shadow-lg shadow-brand-500/30 hover:bg-brand-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        
        <Link
          to="/forgot-password"
          className="block text-center text-brand-500 text-sm font-medium hover:underline mt-4">
          Forgot your password?
        </Link>
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-brand-500 text-sm font-medium hover:underline"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </form>
    </div>
  );
}