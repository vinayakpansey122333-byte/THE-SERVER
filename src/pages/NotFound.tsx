import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 text-center">
      <div className="mc-panel p-8 sm:p-12 border-[#362F47] bg-[#13101E] max-w-lg space-y-6">
        <div className="font-mono text-5xl font-bold text-purple-400 font-pixel">
          404
        </div>
        <h1 className="font-pixel text-2xl sm:text-3xl font-bold text-white uppercase">
          Chunk Not Generated
        </h1>
        <p className="text-xs sm:text-sm text-[#A29DB3] leading-relaxed">
          The requested coordinate or page does not exist in this realm. It may have been relocated or pruned during world boundary maintenance.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="mc-btn mc-btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider inline-block"
          >
            Teleport Back Home (/spawn)
          </Link>
        </div>
      </div>
    </div>
  );
};
