// src/components/MobileContainer.jsx
import React from 'react';

export default function MobileContainer({ children }) {
  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {children}
    </div>
  );
}