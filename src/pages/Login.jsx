// src/pages/Login.jsx (additions)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signup(email, password, name);
        toast('Account created! You can now log in.');
        setIsSignUp(false);
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (error) {
      toast(error.message, 'error');
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col justify-center px-8 relative h-full">
      {/* ... header ... */}

      <form onSubmit={handleSubmit} className="mt-32 space-y-5">
        {isSignUp && (
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Full Name</label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm"
              value={name}
              onChange={e => setName(e.target.value)}
              required={isSignUp}
            />
          </div>
        )}
        {/* email input */}
        {/* password input */}
        <button type="submit" className="w-full bg-brand-500 text-white rounded-xl py-4 font-semibold">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-brand-500 text-sm font-medium"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </form>
    </div>
  );
}