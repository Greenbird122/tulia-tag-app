// src/pages/EditProfile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAuth, updatePassword, updateProfile } from 'firebase/auth';
import { toast } from '../components/Toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/components/SafeIcon';

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (name !== user?.displayName) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      if (newPassword) {
        if (newPassword !== confirmPassword) {
          toast('Passwords do not match', 'error');
          setLoading(false);
          return;
        }
        if (newPassword.length < 6) {
          toast('Password must be at least 6 characters', 'error');
          setLoading(false);
          return;
        }
        await updatePassword(auth.currentUser, newPassword);
      }

      toast('Profile updated successfully');
      navigate('/settings');
    } catch (error) {
      toast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto pb-24 px-6 pt-12 h-full">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4">
          <SafeIcon icon={FiIcons.FiArrowLeft} className="text-2xl text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
      </div>

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Your name"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Leave blank to keep current"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-500 text-white py-4 rounded-xl font-semibold shadow-lg shadow-brand-500/30 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}