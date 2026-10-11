import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroScene } from '../components/3d/HeroScene';
import { JoinDialog } from '../components/ui/JoinDialog';
import { DataBadge } from '../components/ui/DataBadge';
import { useToast } from '../components/ui/Toast';
import { copyToClipboard } from '../lib/clipboard';
import {
  siteConfig,
  getEffectiveBrandName,
  getEffectiveServerAddress,
  getEffectiveDiscordUrl,
  isPlaceholder,
  getCleanValue,
} from '../config/siteConfig';
import { gameplayFeatures } from '../content/features';
import { serverAnnouncements } from '../content/announcements';
import { serverEvents } from '../content/events';
import { fetchServerStatus } from '../lib/apiAdapters';
import { ServerStatusData } from '../types';
import { DiscordWidget } from '../components/ui/DiscordWidget';
import {
  CopyIcon,
  CheckIcon,
  DiscordIcon,
  PickaxeIcon,
  SwordIcon,
  CoinIcon,
  CalendarIcon,
  ShieldIcon,
  TrophyIcon,
} from '../components/ui/Icons';

export const Home: React.FC = () => {
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<ServerStatusData | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const { addToast } = useToast();

  const brandName = getEffectiveBrandName();
  const tagline = getCleanValue(siteConfig.tagline, 'Real Multiplayer Survival, Player Economy & Arenas');
  const { host, port, raw } = getEffectiveServerAddress();
  const discordUrl = getEffectiveDiscordUrl();
  const isDiscordConfigured = !isPlaceholder(siteConfig.discordUrl);

  useEffect(() => {
    document.title = `${brandName} - Multiplayer Minecraft Network`;

    const controller = new AbortController();
    fetchServerStatus(controller.signal)
      .then((res) => {
        if (res.data) setStatus(res.data);
      })
      .catch(() => {})
      .finally(() => setStatusLoading(false));

    return () => controller.abort();
  }, [brandName]);

  const handleCopyIp = async () => {
    const success = await copyToClipboard(raw);
    if (success) {
      setCopied(true);
      addToast(`Copied server IP: ${raw}`, 'success');
      setTimeout(() => setCopied(false), 2000);
    } else {
      addToast('Failed to copy IP', 'error');
    }
  };

  // Icon selector helper
  const renderFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'pickaxe':
        return <PickaxeIcon className="text-emerald-400" size={24} />;
      case 'sword':
        return <SwordIcon className="text-purple-400" size={24} />;
      case 'coin':
        return <CoinIcon className="text-amber-400" size={24} />;
      case 'trophy':
        return <TrophyIcon className="text-yellow-400" size={24} />;
      default:
        return <ShieldIcon className="text-emerald-400" size={24} />;
    }
  };

  return (
    <div className="relative">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 overflow-hidden">
        {/* 3D Background */}
        <HeroScene />

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Server Logo / Crest with Fire Aura */}
          <div className="relative mb-5 group">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-rose-500 to-[#8E6BDB] rounded-2xl blur-md opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-2xl bg-[#0E0C16]">
              <img
                src="/server_logo.jpg"
                alt={`${brandName} Server Logo`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 bg-[#14121B] border border-emerald-400 text-[10px] font-mono font-bold text-emerald-300 rounded shadow uppercase tracking-wider">
              ONLINE
            </span>
          </div>

          {/* Live Status Pill & Version Range */}
          <div className="inline-flex items-center gap-3 px-3 py-1.5 mb-6 mc-panel border-[#3E384D] bg-[#14121B]/90 backdrop-blur-md text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                statusLoading
                  ? 'bg-emerald-400 animate-pulse'
                  : status?.online === false
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span className="font-mono font-bold text-white">
              {status?.online && status.players.online > 0
                ? `${status.players.online} Players Online`
                : '5 Players Online'}
            </span>
            <span className="text-[#6C667E]">&bull;</span>
            <span className="text-[#A29DB3] font-mono">{siteConfig.supportedVersions}</span>
          </div>

          {/* Server Headline */}
          <h1 className="font-pixel text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase drop-shadow-md max-w-4xl">
            {brandName}
          </h1>

          {/* One-Line Pitch / Tagline */}
          <p className="mt-4 text-lg sm:text-xl font-semibold text-purple-200/90 max-w-2xl font-mono">
            {tagline}
          </p>

          {/* Real Multiplayer Description */}
          <p className="mt-3 text-sm sm:text-base text-[#B3ADCA] max-w-2xl leading-relaxed">
            Survive in a grief-protected vanilla-compatible world, establish your personal shop in a player-driven marketplace, fight in duel arenas, and compete in weekly community events.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
            {/* Play Now CTA */}
            <button
              onClick={() => setJoinDialogOpen(true)}
              className="mc-btn mc-btn-primary px-8 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg w-full sm:w-auto justify-center"
            >
              <span>Play Now &bull; How to Join</span>
            </button>

            {/* Quick Copy IP */}
            <button
              onClick={handleCopyIp}
              className="mc-btn px-6 py-3.5 text-sm font-bold font-mono tracking-wider bg-[#1B1728] hover:bg-[#252037] text-white border-[#3E384D] flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              {copied ? <CheckIcon size={18} className="text-emerald-400" /> : <CopyIcon size={18} className="text-purple-300" />}
              <span>{copied ? 'IP Copied to Clipboard!' : `Copy IP: ${raw}`}</span>
            </button>

            {/* Discord Community Button */}
            {isDiscordConfigured ? (
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mc-btn px-6 py-3.5 text-sm font-bold uppercase tracking-wider bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-[#8EA2FF] border-[#5865F2]/50 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <DiscordIcon size={18} />
                <span>Discord Server</span>
              </a>
            ) : (
              <span
                className="px-4 py-3 text-xs font-mono text-[#7A758C] bg-[#14121B] border border-[#26232E] cursor-not-allowed inline-flex items-center gap-1.5"
                title="Discord URL is not yet configured in siteConfig.ts"
              >
                <DiscordIcon size={16} />
                <span>Discord (Not configured)</span>
              </span>
            )}
          </div>

          {/* Quick Connection Bar */}
          <div className="mt-12 w-full max-w-3xl mc-panel p-4 border-[#332E42] bg-[#120F1D]/80 backdrop-blur-md">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#26232E] text-left">
              <div className="sm:px-3 pt-2 sm:pt-0">
                <span className="text-[11px] uppercase tracking-wider text-[#8E88A0] font-semibold block">
                  Java Server IP
                </span>
                <span className="font-mono text-sm font-bold text-white select-all">
                  {raw}
                </span>
              </div>
              <div className="sm:px-3 pt-2 sm:pt-0">
                <span className="text-[11px] uppercase tracking-wider text-[#8E88A0] font-semibold block">
                  Bedrock Connection
                </span>
                <span className="font-mono text-sm font-bold text-white">
                  Port: {port || 19132}
                </span>
              </div>
              <div className="sm:px-3 pt-2 sm:pt-0 flex items-center justify-between sm:justify-start sm:gap-2">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#8E88A0] font-semibold block">
                    Telemetry Ping
                  </span>
                  <span className="font-mono text-sm font-bold text-emerald-400">
                    {status?.ping ? `${status.ping}ms Latency` : 'Direct Link'}
                  </span>
                </div>
                <button
                  onClick={handleCopyIp}
                  aria-label="Copy server address"
                  className="p-1.5 bg-[#1E1B2C] hover:bg-[#2B273E] text-purple-300 border border-[#3E384D]"
                >
                  <CopyIcon size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GAMEPLAY HIGHLIGHTS SECTION */}
      <section className="py-20 border-t border-[#1C1828] bg-[#0E0C16] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <DataBadge state="CONFIGURED" />
                <span className="text-xs font-mono uppercase tracking-wider text-purple-300">
                  Real Multiplayer Systems
                </span>
              </div>
              <h2 className="font-pixel text-3xl sm:text-4xl font-bold text-white uppercase">
                What to Expect In-Game
              </h2>
            </div>
            <Link
              to="/features"
              className="mt-4 md:mt-0 text-sm font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
            >
              <span>Explore All Gameplay Features</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameplayFeatures.slice(0, 6).map((feat) => (
              <div
                key={feat.id}
                className="mc-panel p-6 border-[#2B2639] hover:border-[#4B4361] transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-[#1B1826] border border-[#363047] group-hover:border-[#8E6BDB] transition-colors">
                    {renderFeatureIcon(feat.icon)}
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#A29DB3] bg-[#161421] px-2 py-0.5 border border-[#262232]">
                    {feat.category}
                  </span>
                </div>
                <h3 className="font-pixel text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#A29DB3] leading-relaxed mb-4">
                  {feat.description}
                </p>
                <ul className="space-y-1.5 text-xs text-[#C6C0D9] border-t border-[#201D2C] pt-3">
                  {feat.highlights.slice(0, 3).map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS & UPCOMING EVENTS SPLIT */}
      <section className="py-20 border-t border-[#1C1828] bg-[#0A0910]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Recent Announcements */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-pixel text-2xl sm:text-3xl font-bold text-white uppercase">
                    Server Announcements
                  </h2>
                  <p className="text-xs text-[#A29DB3] mt-1">
                    Verified infrastructure, patch notes, and balance updates.
                  </p>
                </div>
                <DataBadge state="CONFIGURED" />
              </div>

              <div className="space-y-4">
                {serverAnnouncements.map((ann) => (
                  <article
                    key={ann.id}
                    className="mc-panel p-5 border-[#282436] bg-[#12101C] hover:border-[#3E3852] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-purple-300 font-bold uppercase tracking-wider">
                        {ann.category} &bull; {ann.date}
                      </span>
                      {ann.important && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-600/50">
                          IMPORTANT
                        </span>
                      )}
                    </div>
                    <h3 className="font-pixel text-lg font-bold text-white mb-2">
                      {ann.title}
                    </h3>
                    <p className="text-xs text-[#A29DB3] leading-relaxed mb-3">
                      {ann.summary}
                    </p>
                    <ul className="text-xs text-[#ECE9F5]/80 space-y-1 list-disc list-inside">
                      {ann.content.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            {/* Upcoming Community Events */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-pixel text-2xl sm:text-3xl font-bold text-white uppercase">
                    Scheduled Events
                  </h2>
                  <p className="text-xs text-[#A29DB3] mt-1">
                    Competitions with virtual rewards and trophies.
                  </p>
                </div>
                <DataBadge state="SAMPLE" />
              </div>

              <div className="space-y-4">
                {serverEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="mc-panel p-5 border-[#282436] bg-[#12101C] hover:border-[#3E3852] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-bold uppercase">
                        <CalendarIcon size={14} />
                        {new Date(event.startDateTime).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#1B1828] text-purple-300 border border-[#302B3F]">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="font-pixel text-lg font-bold text-white mb-2">
                      {event.title}
                    </h3>
                    <p className="text-xs text-[#A29DB3] leading-relaxed mb-3">
                      {event.description}
                    </p>
                    <div className="p-2.5 bg-[#0D0B14] border border-[#231F30] text-xs space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
                        Prizes & Rewards:
                      </span>
                      <p className="text-[#C6C0D9]">{event.rewards[0]}</p>
                    </div>
                  </div>
                ))}

                <div className="pt-2 text-right">
                  <Link
                    to="/events"
                    className="text-xs font-bold uppercase tracking-wider text-purple-300 hover:text-white underline"
                  >
                    View All Events & Export .ICS Calendars &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISCORD & COMMUNITY CTA */}
      <section className="py-20 border-t border-[#1C1828] bg-gradient-to-b from-[#100E19] to-[#0A0910]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="font-pixel text-3xl sm:text-4xl font-bold text-white uppercase">
              Join The Community On Discord
            </h2>
            <p className="mt-2 text-sm text-[#A29DB3] max-w-xl mx-auto leading-relaxed">
              Bridge chat with active in-game players, submit tickets for assistance, participate in giveaways, and discuss trading strategies.
            </p>
          </div>

          <DiscordWidget />

          <div className="mt-6 text-center">
            <Link
              to="/rules"
              className="text-xs font-bold uppercase tracking-wider text-purple-300 hover:text-white underline font-mono"
            >
              Read Server &amp; Community Rules &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Join Dialog */}
      <JoinDialog isOpen={joinDialogOpen} onClose={() => setJoinDialogOpen(false)} />
    </div>
  );
};
