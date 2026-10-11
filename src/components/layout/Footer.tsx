import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getEffectiveBrandName,
  getEffectiveServerAddress,
  getEffectiveDiscordUrl,
  siteConfig,
  isSetupModeActive,
} from '../../config/siteConfig';
import { copyToClipboard } from '../../lib/clipboard';
import { useToast } from '../ui/Toast';
import { CopyIcon, CheckIcon, DiscordIcon } from '../ui/Icons';

export const Footer: React.FC = () => {
  const brandName = getEffectiveBrandName();
  const { raw } = getEffectiveServerAddress();
  const discordUrl = getEffectiveDiscordUrl();
  const setupMode = isSetupModeActive();
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handleCopyIp = async () => {
    const success = await copyToClipboard(raw);
    if (success) {
      setCopied(true);
      addToast(`Copied server IP: ${raw}`, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="bg-[#07060B] border-t border-[#1F1B2B] text-[#A29DB3] text-xs pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#1A1724]">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/server_logo.jpg"
                alt={brandName}
                className="w-7 h-7 rounded object-cover border border-emerald-400/80 shadow"
              />
              <span className="font-pixel text-lg font-bold text-white tracking-wider">
                {brandName}
              </span>
            </div>
            <p className="text-xs text-[#8E88A0] leading-relaxed">
              A community-driven multiplayer Minecraft network dedicated to fair survival, player-led trading, and competitive events.
            </p>
            <div className="pt-2">
              <button
                onClick={handleCopyIp}
                className="mc-btn px-3 py-1.5 bg-[#14121F] hover:bg-[#1E1A2C] border-[#2D283C] text-white font-mono text-xs flex items-center gap-2"
                title="Copy Server IP"
              >
                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                <span>{copied ? 'Copied IP!' : raw}</span>
              </button>
            </div>
          </div>

          {/* Gameplay & Server Navigation */}
          <div>
            <h4 className="font-pixel text-white text-sm font-bold uppercase tracking-wider mb-3">
              Server
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Gameplay
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Gameplay Features
                </Link>
              </li>
              <li>
                <Link to="/status" className="hover:text-white transition-colors">
                  Server Telemetry & Status
                </Link>
              </li>
              <li>
                <Link to="/leaderboards" className="hover:text-white transition-colors">
                  Player Leaderboards
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Upcoming Tournaments
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Moderation */}
          <div>
            <h4 className="font-pixel text-white text-sm font-bold uppercase tracking-wider mb-3">
              Community
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/rules" className="hover:text-white transition-colors">
                  Server Rules & Bans
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-white transition-colors">
                  Staff Directory & Appeals
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-white transition-colors flex items-center gap-1 text-purple-300">
                  <span className="w-1.5 h-1.5 bg-purple-400" />
                  AI Rule & Command Helper
                </Link>
              </li>
              <li>
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1 text-[#8EA2FF]"
                >
                  <DiscordIcon size={14} />
                  <span>Discord Community</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Compliance & Administration */}
          <div>
            <h4 className="font-pixel text-white text-sm font-bold uppercase tracking-wider mb-3">
              Network Admin
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/setup"
                  className={`transition-colors flex items-center gap-1.5 ${
                    setupMode ? 'text-amber-300 font-semibold hover:text-white' : 'hover:text-white'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 ${setupMode ? 'bg-amber-400' : 'bg-gray-500'}`} />
                  Setup Mode & Config Audit
                </Link>
              </li>
              <li>
                <span className="text-[#6D6880] block text-[11px]">
                  Supported: {siteConfig.supportedVersions}
                </span>
              </li>
              <li>
                <span className="text-[#6D6880] block text-[11px]">
                  Timezone: {siteConfig.timezone}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Mojang EULA Compliance Note */}
        <div className="pt-6 space-y-3">
          <p className="text-[11px] text-[#7A758C] leading-relaxed">
            <strong>Commercial Guidelines Compliance:</strong> All supporter purchases and rewards conform strictly to Mojang's Commercial Usage Guidelines. We do not provide pay-to-win combat advantages, unbannable immunity, or unfair gameplay items. Purchases fund ongoing server hardware, anti-DDoS mitigation, and community event rewards.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[#14121D] text-[11px] text-[#635E73]">
            <p>
              Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.
            </p>
            <p className="font-mono text-[10px]">
              &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
