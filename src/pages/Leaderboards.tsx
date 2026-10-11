import React, { useState, useEffect } from 'react';
import {
  fetchLeaderboards,
  StatCategory,
  StatPeriod,
  SAMPLE_LEADERBOARDS,
} from '../lib/leaderboardAdapter';
import { LeaderboardEntry } from '../types';
import { DataBadge } from '../components/ui/DataBadge';
import {
  siteConfig,
  getEffectiveBrandName,
  isPlaceholder,
} from '../config/siteConfig';

export const Leaderboards: React.FC = () => {
  const brandName = getEffectiveBrandName();
  const [activeCategory, setActiveCategory] = useState<StatCategory>('playtime');
  const [activePeriod, setActivePeriod] = useState<StatPeriod>('all-time');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnavailable, setIsUnavailable] = useState<boolean>(false);
  const [showSampleData, setShowSampleData] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  useEffect(() => {
    document.title = `Leaderboards & Statistics - ${brandName}`;
  }, [brandName]);

  const loadData = () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    fetchLeaderboards(activeCategory, activePeriod, controller.signal)
      .then((res) => {
        if (res.state === 'UNAVAILABLE') {
          setIsUnavailable(true);
          setEntries([]);
        } else if (res.state === 'ERROR') {
          setError(res.error || 'Failed to fetch leaderboard data');
          setEntries([]);
        } else if (res.data) {
          setIsUnavailable(false);
          setEntries(res.data.entries);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  };

  useEffect(() => {
    loadData();
  }, [activeCategory, activePeriod]);

  // Determine effective display entries
  const displayedEntries = (showSampleData && isUnavailable ? SAMPLE_LEADERBOARDS[activeCategory] : entries).filter(
    (e) => e.username.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const getRankBadgeClass = (rank: number) => {
    if (rank === 1) return 'bg-amber-400 text-black border-amber-300 font-bold';
    if (rank === 2) return 'bg-slate-300 text-black border-slate-200 font-bold';
    if (rank === 3) return 'bg-amber-700 text-white border-amber-600 font-bold';
    return 'bg-[#1C182A] text-[#A29DB3] border-[#2E2840]';
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-[#252033] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DataBadge
                state={showSampleData ? 'SAMPLE' : isUnavailable ? 'UNAVAILABLE' : 'LIVE'}
                customLabel={showSampleData ? 'SAMPLE DATA PREVIEW' : undefined}
              />
              <span className="text-xs font-mono uppercase tracking-wider text-purple-300">
                In-Game Statistics & Rankings
              </span>
            </div>
            <h1 className="font-pixel text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight">
              Server Leaderboards
            </h1>
            <p className="mt-2 text-sm text-[#B3ADCA] max-w-2xl leading-relaxed">
              Track top active survivalists across playtime, player-versus-player eliminations, virtual currency balance, and total blocks excavated.
            </p>
          </div>

          {/* Period Filter (All-Time / Monthly) */}
          <div className="flex gap-1.5 p-1 bg-[#12101C] border border-[#2B273A]" role="group" aria-label="Time period">
            <button
              onClick={() => setActivePeriod('all-time')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
                activePeriod === 'all-time'
                  ? 'bg-purple-900/80 text-white border border-purple-500/50'
                  : 'text-[#A29DB3] hover:text-white'
              }`}
            >
              All-Time
            </button>
            <button
              onClick={() => setActivePeriod('monthly')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
                activePeriod === 'monthly'
                  ? 'bg-purple-900/80 text-white border border-purple-500/50'
                  : 'text-[#A29DB3] hover:text-white'
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        {/* Category Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5" role="tablist">
            {(
              [
                { id: 'playtime', label: 'Playtime' },
                { id: 'kills', label: 'PvP Kills' },
                { id: 'balance', label: 'Economy Balance' },
                { id: 'blocks_mined', label: 'Blocks Mined' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-purple-900/60 text-white border border-purple-500/50'
                    : 'bg-[#14121B] text-[#A29DB3] hover:text-white border border-[#2B273A]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search player username..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 text-xs bg-[#12101C] border border-[#2F293E] text-white placeholder-[#78728A] focus:outline-none focus:border-[#8E6BDB]"
            />
          </div>
        </div>

        {/* Unavailable State Notice */}
        {isUnavailable && !showSampleData && (
          <div className="mc-panel p-8 border-[#3D374D] bg-[#141120] text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-10 h-10 bg-[#252035] border border-[#48405E] flex items-center justify-center mx-auto text-purple-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h3 className="font-pixel text-xl font-bold text-white mb-2">
                Leaderboard API Not Configured
              </h3>
              <p className="text-xs text-[#A29DB3] leading-relaxed max-w-md mx-auto">
                No live statistics plugin or REST backend is currently attached to <code>siteConfig.statsApiUrl</code>. As per our honesty guidelines, we never fabricate live player data.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setShowSampleData(true)}
                className="mc-btn px-4 py-2 text-xs font-bold uppercase tracking-wider bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-600/50"
              >
                Preview with Sample Rows (Watermarked)
              </button>
            </div>
          </div>
        )}

        {/* Sample Mode Banner if toggled */}
        {showSampleData && (
          <div className="p-3 bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400" />
              <span>
                <strong>Sample Preview Mode:</strong> The rows below are demonstration placeholders. They do not represent real players on the server.
              </span>
            </div>
            <button
              onClick={() => setShowSampleData(false)}
              className="text-amber-400 hover:text-white underline font-bold text-[11px] ml-4"
            >
              Hide Sample Data
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-[#14121F] border border-[#252135] animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Leaderboard Table */}
        {!loading && (!isUnavailable || showSampleData) && (
          <div className="mc-panel border-[#2B2639] bg-[#12101C] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181524] border-b border-[#2B2639] text-[#A29DB3] font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Rank</th>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Badge / Title</th>
                  <th className="py-3 px-4 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1C2B]">
                {displayedEntries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#A29DB3]">
                      No players found matching your search.
                    </td>
                  </tr>
                ) : (
                  displayedEntries.map((row) => (
                    <tr
                      key={row.username}
                      className="hover:bg-[#1A1728] transition-colors"
                    >
                      {/* Rank */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 text-xs border ${getRankBadgeClass(
                            row.rank
                          )}`}
                        >
                          #{row.rank}
                        </span>
                      </td>

                      {/* Player Username & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://mc-heads.net/avatar/${row.username}/28`}
                            alt={row.username}
                            className="w-7 h-7 bg-[#201D2E] border border-[#3E384D] pixelated"
                            onError={(e) => {
                              // Procedural pixel avatar fallback on error
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <span className="font-mono font-bold text-white text-sm">
                            {row.username}
                          </span>
                        </div>
                      </td>

                      {/* Badge / Title */}
                      <td className="py-3 px-4">
                        {row.badge ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#201B2E] text-purple-300 border border-[#3D3554]">
                            {row.badge}
                          </span>
                        ) : (
                          <span className="text-[#6D677D] font-mono text-[11px]">—</span>
                        )}
                      </td>

                      {/* Formatted Value */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                        {row.formattedValue}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
