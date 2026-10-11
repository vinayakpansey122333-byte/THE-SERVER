import React from 'react';
import { DataSourceState } from '../../types';

interface DataBadgeProps {
  state: DataSourceState;
  className?: string;
  customLabel?: string;
}

export const DataBadge: React.FC<DataBadgeProps> = ({ state, className = '', customLabel }) => {
  switch (state) {
    case 'LIVE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-none bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 ${className}`}
          title="Direct verified real-time data"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {customLabel || 'LIVE'}
        </span>
      );

    case 'CONFIGURED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium uppercase tracking-wider rounded-none bg-[#1A1828] text-purple-300 border border-purple-500/30 ${className}`}
          title="Configured server setting"
        >
          <span className="w-1.5 h-1.5 bg-purple-400" />
          {customLabel || 'CONFIGURED'}
        </span>
      );

    case 'SAMPLE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-none bg-amber-950/80 text-amber-300 border border-amber-500/50 ${className}`}
          title="Sample placeholder content for preview only"
        >
          <span className="w-1.5 h-1.5 bg-amber-400" />
          {customLabel || 'SAMPLE – edit in config'}
        </span>
      );

    case 'STALE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium uppercase tracking-wider rounded-none bg-yellow-950/70 text-yellow-400 border border-yellow-600/40 ${className}`}
          title="Cached data; latest refresh pending"
        >
          <span className="w-1.5 h-1.5 bg-yellow-400" />
          {customLabel || 'STALE'}
        </span>
      );

    case 'LOADING':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium uppercase tracking-wider rounded-none bg-[#1C1A27] text-gray-300 border border-gray-600/30 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-ping" />
          {customLabel || 'LOADING'}
        </span>
      );

    case 'UNAVAILABLE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium uppercase tracking-wider rounded-none bg-[#181622] text-zinc-400 border border-zinc-700/40 ${className}`}
          title="Feature not configured or offline"
        >
          <span className="w-1.5 h-1.5 bg-zinc-500" />
          {customLabel || 'NOT CONFIGURED'}
        </span>
      );

    case 'ERROR':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium uppercase tracking-wider rounded-none bg-red-950/80 text-red-400 border border-red-500/40 ${className}`}
          title="Failed to fetch data"
        >
          <span className="w-1.5 h-1.5 bg-red-400" />
          {customLabel || 'ERROR'}
        </span>
      );

    default:
      return null;
  }
};
