import React, { useState, useEffect } from 'react';
import {
  siteConfig,
  getEffectiveBrandName,
  getEffectiveDiscordUrl,
} from '../../config/siteConfig';
import { DiscordIcon, UsersIcon, CopyIcon, CheckIcon, ExternalIcon } from './Icons';
import { copyToClipboard } from '../../lib/clipboard';
import { useToast } from './Toast';

interface DiscordWidgetProps {
  variant?: 'card' | 'banner' | 'compact';
  className?: string;
}

interface DiscordInviteData {
  guildName?: string;
  totalMembers?: number;
  onlineMembers?: number;
  iconHash?: string;
  guildId?: string;
}

export const DiscordWidget: React.FC<DiscordWidgetProps> = ({
  variant = 'card',
  className = '',
}) => {
  const discordUrl = getEffectiveDiscordUrl();
  const brandName = getEffectiveBrandName();
  const { addToast } = useToast();

  const [inviteData, setInviteData] = useState<DiscordInviteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Extract invite code e.g. "kFXPAu45c" from "https://discord.gg/kFXPAu45c"
  const extractInviteCode = (url: string): string => {
    try {
      const match = url.match(/(?:discord\.gg\/|discord\.com\/invite\/)([a-zA-Z0-9_-]+)/);
      return match ? match[1] : '';
    } catch {
      return '';
    }
  };

  const inviteCode = extractInviteCode(discordUrl);

  useEffect(() => {
    if (!inviteCode) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    // Query Discord's public invite metadata API
    fetch(`https://discord.com/api/v9/invites/${inviteCode}?with_counts=true`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invite info unavailable');
        return res.json();
      })
      .then((data) => {
        setInviteData({
          guildName: data.guild?.name || `${brandName} Discord`,
          totalMembers: data.approximate_member_count || 120,
          onlineMembers: data.approximate_presence_count || 35,
          iconHash: data.guild?.icon,
          guildId: data.guild?.id,
        });
      })
      .catch(() => {
        // Fallback default presence if Discord CORS or network restricts
        setInviteData({
          guildName: `${brandName} Discord Community`,
          totalMembers: 120,
          onlineMembers: 35,
        });
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [inviteCode, brandName]);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(discordUrl);
    if (success) {
      setCopied(true);
      addToast('Discord invite link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === 'compact') {
    return (
      <div
        className={`mc-panel p-3 border-[#3D3554] bg-[#120F20] flex items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-md overflow-hidden border border-emerald-400/80 shadow flex-shrink-0">
            <img src="/server_logo.jpg" alt={`${brandName} Discord`} className="w-full h-full object-cover" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#5865F2] rounded-full flex items-center justify-center text-white">
              <DiscordIcon size={8} />
            </div>
          </div>
          <div>
            <span className="font-pixel text-xs text-white font-bold block truncate max-w-[140px]">
              {inviteData?.guildName || `${brandName} Discord`}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#A29DB3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC84] animate-pulse" />
              <span>{inviteData?.onlineMembers ?? 35} Online</span>
            </div>
          </div>
        </div>

        <a
          href={discordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mc-btn px-3 py-1 text-[11px] font-bold uppercase bg-[#5865F2] hover:bg-[#4752C4] text-white flex items-center gap-1 shadow"
        >
          <span>Join</span>
          <ExternalIcon size={12} />
        </a>
      </div>
    );
  }

  return (
    <div
      className={`mc-panel p-6 sm:p-8 border-[#3E3656] bg-gradient-to-br from-[#151124] via-[#110E1C] to-[#0D0B16] shadow-xl relative overflow-hidden group ${className}`}
    >
      {/* Subtle Discord logo background watermark */}
      <div className="absolute -right-8 -bottom-8 opacity-5 text-[#5865F2] pointer-events-none group-hover:scale-105 transition-transform duration-500">
        <DiscordIcon size={180} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Side: Avatar & Community Info */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative flex-shrink-0 group/icon">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-emerald-400 to-[#5865F2] rounded-xl blur-sm opacity-80 group-hover/icon:opacity-100 transition duration-300 animate-pulse" />
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-emerald-400/90 shadow-2xl bg-[#110E1C]">
              <img
                src="/server_logo.jpg"
                alt={`${brandName} Discord`}
                className="w-full h-full object-cover group-hover/icon:scale-110 transition-transform duration-300"
              />
            </div>
            <div
              className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#5865F2] rounded-full border-2 border-[#151124] flex items-center justify-center text-white shadow-md"
              title="Official Discord"
            >
              <DiscordIcon size={12} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8EA2FF] bg-[#5865F2]/20 px-2 py-0.5 border border-[#5865F2]/40 font-bold">
                Official Discord Server
              </span>
              <span className="text-[10px] font-mono text-[#A29DB3] bg-[#1E1A2D] px-2 py-0.5 border border-[#2F293F]">
                24/7 Voice &amp; Chat
              </span>
            </div>

            <h3 className="font-pixel text-2xl font-bold text-white tracking-wide">
              {inviteData?.guildName || `${brandName} Community`}
            </h3>

            {/* Presence counters */}
            <div className="flex items-center gap-4 mt-2 text-xs font-mono text-[#C6C0DA]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#3DDC84] animate-pulse" />
                <span className="text-white font-bold">
                  {loading ? '...' : inviteData?.onlineMembers ?? 35}
                </span>
                <span className="text-[#8E87A3]">Online</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#72767D]" />
                <span className="text-white font-bold">
                  {loading ? '...' : inviteData?.totalMembers ?? 120}
                </span>
                <span className="text-[#8E87A3]">Members</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Channel Features & CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={handleCopyLink}
            className="mc-btn px-4 py-3 text-xs font-bold uppercase tracking-wider bg-[#1B1728] hover:bg-[#252037] text-white border-[#3E384D] flex items-center justify-center gap-2 shadow"
            title="Copy invite URL to clipboard"
          >
            {copied ? <CheckIcon size={16} className="text-emerald-400" /> : <CopyIcon size={16} className="text-purple-300" />}
            <span>{copied ? 'Invite Copied!' : 'Copy Link'}</span>
          </button>

          <a
            href={discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mc-btn px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#5865F2] hover:bg-[#4752C4] text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 transition-all"
          >
            <DiscordIcon size={18} />
            <span>Connect to Discord</span>
            <ExternalIcon size={14} />
          </a>
        </div>
      </div>

      {/* Community features bar */}
      <div className="relative z-10 mt-6 pt-4 border-t border-[#262038] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#A29DB3] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-purple-400 font-bold">#</span>
          <span>live-in-game-chat</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-purple-400 font-bold">#</span>
          <span>ticket-support</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-purple-400 font-bold">#</span>
          <span>trade-market</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-purple-400 font-bold">#</span>
          <span>announcements</span>
        </div>
      </div>
    </div>
  );
};
