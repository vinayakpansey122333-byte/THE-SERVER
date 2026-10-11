import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlaceholderAudits } from '../../config/siteConfig';

export const SetupBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const audits = getPlaceholderAudits();
  const unconfiguredCount = audits.filter((a) => !a.isConfigured).length;

  if (isDismissed || unconfiguredCount === 0) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Setup Mode Notice"
      className="bg-amber-950/90 border-b border-amber-500/40 text-amber-200 px-4 py-2.5 text-xs sm:text-sm font-medium z-40 relative flex items-center justify-between"
    >
      <div className="flex items-center gap-2 max-w-5xl mx-auto flex-1">
        <span className="flex-shrink-0 w-2 h-2 bg-amber-400 animate-ping" />
        <span>
          <strong>Setup Mode Active:</strong> {unconfiguredCount} placeholder{' '}
          {unconfiguredCount === 1 ? 'value needs' : 'values need'} configuration before public launch.
        </span>
        <Link
          to="/setup"
          className="underline font-bold text-amber-300 hover:text-white ml-2 inline-flex items-center gap-1"
        >
          View Setup Guide &rarr;
        </Link>
      </div>
      <button
        onClick={() => setIsDismissed(true)}
        aria-label="Dismiss setup banner"
        className="text-amber-400 hover:text-white p-1 ml-3"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};
