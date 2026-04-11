import React from 'react';

export default function MobileContainer({ children }) {
  return (
    <div className="bg-white w-full max-w-[420px] h-[100dvh] sm:h-[850px] sm:rounded-[40px] sm:shadow-2xl relative overflow-hidden flex flex-col font-sans">
      {children}
    </div>
  );
}