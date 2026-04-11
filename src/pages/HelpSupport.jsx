import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/components/SafeIcon';
import { toast } from '../components/Toast';

export default function HelpSupport() {
  const navigate = useNavigate();

  const faqs = [
    { q: 'How do I add a new tracker?', a: 'Tap the + button on the dashboard and enter the tracker ID found on the device.' },
    { q: 'What happens when I activate Lost Mode?', a: 'A public tracking link is generated. Share it with anyone who might help locate your item.' },
    { q: 'How long does Lost Mode last?', a: 'You choose between 6, 12, 24, or 48 hours. You can also end it early.' },
  ];

  const handleContact = () => {
    toast('Support team notified – we will email you shortly', 'success');
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto pb-24 px-6 pt-12 h-full">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4">
          <SafeIcon icon={FiIcons.FiArrowLeft} className="text-2xl text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100 mb-6">
        {faqs.map((item, i) => (
          <details key={i} className="p-5 group">
            <summary className="flex justify-between items-center font-medium text-gray-900 cursor-pointer">
              {item.q}
              <SafeIcon icon={FiIcons.FiChevronDown} className="text-gray-400 group-open:rotate-180 transition-transform" />
            </summary>
            <p className="text-sm text-gray-600 mt-3 pl-2">{item.a}</p>
          </details>
        ))}
      </div>

      <button
        onClick={handleContact}
        className="w-full bg-brand-500 text-white py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center"
      >
        <SafeIcon icon={FiIcons.FiMail} className="mr-2" />
        Contact Support
      </button>

      <p className="text-center text-gray-400 text-xs mt-6">Tulia Tag v1.0.0</p>
    </div>
  );
}