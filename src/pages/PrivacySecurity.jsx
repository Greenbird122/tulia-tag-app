import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/components/SafeIcon';

export default function PrivacySecurity() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto pb-24 px-6 pt-12 h-full">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4">
          <SafeIcon icon={FiIcons.FiArrowLeft} className="text-2xl text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Privacy & Security</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Data Encryption</h3>
          <p className="text-sm text-gray-600">All your location data is encrypted in transit and at rest using industry‑standard protocols.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Location Privacy</h3>
          <p className="text-sm text-gray-600">Your device locations are only shared when you activate Lost Mode. Helpers only see the approximate area.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Data Retention</h3>
          <p className="text-sm text-gray-600">Lost session data is automatically deleted after 30 days. You can also manually clear history.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Two‑Factor Authentication</h3>
          <p className="text-sm text-gray-600">Coming soon – we recommend enabling 2FA for added security.</p>
        </div>
      </div>
    </div>
  );
}