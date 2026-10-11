import React, { useState, useEffect } from 'react';
import { serverEvents } from '../content/events';
import { ServerEvent } from '../types';
import { DataBadge } from '../components/ui/DataBadge';
import { downloadEventIcs } from '../lib/icsGenerator';
import { useToast } from '../components/ui/Toast';
import {
  siteConfig,
  getEffectiveBrandName,
} from '../config/siteConfig';
import { CalendarIcon, TrophyIcon } from '../components/ui/Icons';

function getTimeRemaining(targetDateStr: string) {
  const total = new Date(targetDateStr).getTime() - Date.now();
  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds, isPast: false };
}

export const Events: React.FC = () => {
  const brandName = getEffectiveBrandName();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [now, setNow] = useState<number>(Date.now());
  const { addToast } = useToast();

  useEffect(() => {
    document.title = `Events & Tournaments - ${brandName}`;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [brandName]);

  const categories = ['all', 'tournament', 'building', 'pvp', 'community'];

  const upcomingEvents = serverEvents.filter((e) => {
    const isUpcomingOrOngoing = new Date(e.endDateTime).getTime() > now;
    const matchesCat = selectedCategory === 'all' || e.category === selectedCategory;
    return isUpcomingOrOngoing && matchesCat;
  });

  const completedEvents = serverEvents.filter((e) => {
    const isPast = new Date(e.endDateTime).getTime() <= now;
    const matchesCat = selectedCategory === 'all' || e.category === selectedCategory;
    return isPast && matchesCat;
  });

  const handleExportIcs = (event: ServerEvent) => {
    try {
      downloadEventIcs(event);
      addToast(`Downloaded calendar invite for "${event.title}"!`, 'success');
    } catch {
      addToast('Failed to generate calendar invite', 'error');
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-[#252033] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DataBadge state="SAMPLE" customLabel="SAMPLE SCHEDULE – EDIT IN CONFIG" />
              <span className="text-xs font-mono uppercase tracking-wider text-purple-300">
                Scheduled Tournaments & Competitions
              </span>
            </div>
            <h1 className="font-pixel text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight">
              Community Events
            </h1>
            <p className="mt-2 text-sm text-[#B3ADCA] max-w-2xl leading-relaxed">
              Compete for in-game currency, cosmetic prefix titles, and vanity trophies. Times shown in your local device timezone ({Intl.DateTimeFormat().resolvedOptions().timeZone}) and server timezone ({siteConfig.timezone}).
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? 'bg-purple-900/60 text-white border border-purple-500/50'
                    : 'bg-[#14121B] text-[#A29DB3] hover:text-white border border-[#2B273A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Events Grid */}
        <div className="space-y-6">
          <h2 className="font-pixel text-2xl font-bold text-white uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400" />
            Upcoming & Live Competitions
          </h2>

          {upcomingEvents.length === 0 ? (
            <div className="mc-panel p-10 text-center border-[#2A2538] bg-[#12101C]">
              <p className="text-white font-pixel text-lg">No upcoming events scheduled in this category.</p>
              <p className="text-xs text-[#A29DB3] mt-1">Check back soon or suggest an event on our community Discord.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => {
                const countdown = getTimeRemaining(event.startDateTime);
                const startDate = new Date(event.startDateTime);
                const endDate = new Date(event.endDateTime);
                const isOngoing = now >= startDate.getTime() && now <= endDate.getTime();

                return (
                  <div
                    key={event.id}
                    className="mc-panel p-6 border-[#2F293E] bg-[#13111E] hover:border-[#4B4361] transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Meta */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-purple-300 bg-[#1C182A] px-2 py-0.5 border border-[#302B3F]">
                          {event.category}
                        </span>
                        {isOngoing ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/40 animate-pulse">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            LIVE NOW
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-purple-300">
                            Starts in: {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                          </span>
                        )}
                      </div>

                      {/* Event Title */}
                      <h3 className="font-pixel text-2xl font-bold text-white mb-2">
                        {event.title}
                      </h3>
                      <p className="text-xs text-[#A29DB3] leading-relaxed mb-4">
                        {event.description}
                      </p>

                      {/* Schedule Timestamps */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#0C0A14] border border-[#231F30] text-xs font-mono mb-4">
                        <div>
                          <span className="text-[#7D7791] text-[10px] block uppercase">Starts:</span>
                          <span className="text-white">
                            {startDate.toLocaleString(undefined, {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#7D7791] text-[10px] block uppercase">Ends:</span>
                          <span className="text-white">
                            {endDate.toLocaleString(undefined, {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Rewards */}
                      <div className="mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1 mb-1.5">
                          <TrophyIcon size={14} />
                          Prizes & Rewards:
                        </span>
                        <ul className="text-xs text-[#C6C0D9] space-y-1 list-disc list-inside">
                          {event.rewards.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Participation steps */}
                      <div className="mb-4 text-xs text-[#A29DB3]">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-white block mb-1">
                          How to Participate:
                        </span>
                        <ol className="space-y-1 list-decimal list-inside text-[#C6C0D9]">
                          {event.participationSteps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    {/* Bottom action: Add to calendar */}
                    <div className="pt-4 border-t border-[#201D2C] flex items-center justify-between">
                      <DataBadge state="SAMPLE" />
                      <button
                        onClick={() => handleExportIcs(event)}
                        className="mc-btn px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1B1828] hover:bg-[#252037] text-white border-[#3E384D] flex items-center gap-2"
                        title="Download .ics calendar event"
                      >
                        <CalendarIcon size={14} />
                        <span>Add to Calendar (.ics)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Events Archive */}
        {completedEvents.length > 0 && (
          <div className="space-y-6 pt-8 border-t border-[#201D2C]">
            <h2 className="font-pixel text-xl font-bold text-[#A29DB3] uppercase">
              Event Archive (Completed)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedEvents.map((event) => (
                <div
                  key={event.id}
                  className="mc-panel p-4 border-[#242030] bg-[#0E0C16] opacity-80"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-[#7D7791] mb-1">
                    <span>{event.category.toUpperCase()}</span>
                    <span>Concluded</span>
                  </div>
                  <h4 className="font-pixel text-lg text-white font-bold">{event.title}</h4>
                  <p className="text-xs text-[#8E87A3] mt-1">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
