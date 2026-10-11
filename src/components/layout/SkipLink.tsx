import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 px-4 py-2 bg-emerald-500 text-black font-bold uppercase text-xs tracking-wider shadow-lg border border-emerald-400 outline-none"
    >
      Skip to main content
    </a>
  );
};
