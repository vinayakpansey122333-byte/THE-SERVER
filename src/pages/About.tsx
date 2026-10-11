import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DataBadge } from '../components/ui/DataBadge';
import {
  siteConfig,
  getEffectiveBrandName,
  getEffectiveServerAddress,
  getEffectiveManagerName,
} from '../config/siteConfig';

export const About: React.FC = () => {
  const brandName = getEffectiveBrandName();
  const { host, port, raw } = getEffectiveServerAddress();
  const managerName = getEffectiveManagerName();

  useEffect(() => {
    document.title = `About - ${brandName} Minecraft Network`;
  }, [brandName]);

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-[#252033] pb-8">
          <div className="flex items-center gap-2 mb-3">
            <DataBadge state="CONFIGURED" />
            <span className="text-xs font-mono uppercase tracking-wider text-purple-300">
              Multiplayer Architecture & Vision
            </span>
          </div>
          <h1 className="font-pixel text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight">
            About {brandName}
          </h1>
          <p className="mt-3 text-base text-[#B3ADCA] leading-relaxed">
            A real multiplayer Minecraft server dedicated to survival gameplay, fair economics, and player freedom. No scripted storylines, no fake player counts, and no pay-to-win advantages.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="space-y-8">
          {/* Pillar 1: Pure Survival with Quality of Life */}
          <div className="mc-panel p-6 sm:p-8 border-[#2D283C] bg-[#13111E]">
            <h2 className="font-pixel text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-emerald-400">&bull;</span>
              Enhanced Survival Progression
            </h2>
            <p className="text-sm text-[#A29DB3] leading-relaxed mb-4">
              We retain the authentic Minecraft survival loop: harvesting timber, mining minerals, breeding livestock, and venturing into dangerous Nether and End structures. We augment this with grief-prevention land claiming so your builds, automated redstone machines, and chests remain secure from unauthorized destruction.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#C6C0D9] bg-[#0C0B12] p-4 border border-[#231E30]">
              <div>&bull; <strong>Land Claims:</strong> Golden shovel claim boundaries (/claim)</div>
              <div>&bull; <strong>Teleportation:</strong> Set homes (/sethome) & player requests (/tpa)</div>
              <div>&bull; <strong>Mob Mechanics:</strong> Vanilla mob spawns with optimized AI ticking</div>
              <div>&bull; <strong>World Border:</strong> Generous exploration radius across all dimensions</div>
            </div>
          </div>

          {/* Pillar 2: Virtual Currency & Marketplace */}
          <div className="mc-panel p-6 sm:p-8 border-[#2D283C] bg-[#13111E]">
            <h2 className="font-pixel text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-amber-400">&bull;</span>
              Player-Driven Economy & Trade
            </h2>
            <p className="text-sm text-[#A29DB3] leading-relaxed mb-4">
              All virtual currency is minted and circulated strictly through gameplay. Players earn coins by selling gathered materials to the server store, completing daily milestones, and creating commercial trade agreements with other players through chest shops and the Global Auction House.
            </p>
            <p className="text-xs text-[#8E87A3] leading-relaxed border-t border-[#231F32] pt-3">
              <strong>Notice:</strong> Real-Money Trading (RMT) is strictly prohibited. You cannot buy in-game balance with fiat currency. The economy is 100% player earned.
            </p>
          </div>

          {/* Pillar 3: Fair Combat & Arena Systems */}
          <div className="mc-panel p-6 sm:p-8 border-[#2D283C] bg-[#13111E]">
            <h2 className="font-pixel text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-purple-400">&bull;</span>
              Balanced Combat & Duel Arenas
            </h2>
            <p className="text-sm text-[#A29DB3] leading-relaxed mb-4">
              Combat is kept fun and consensual. While the main survival wilderness has keep-inventory active to protect peaceful builders, dedicated warzones and Colosseum dueling arenas allow competitive fighters to test their skills in 1v1 matchups with equal gear kits.
            </p>
          </div>

          {/* Technical Specifications */}
          <div className="mc-panel p-6 sm:p-8 border-[#2D283C] bg-[#13111E]">
            <h2 className="font-pixel text-2xl font-bold text-white mb-4">
              Server Infrastructure & Node Specs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#0C0B12] border border-[#231E30]">
                <span className="text-[#8E87A3] block uppercase tracking-wider text-[10px] font-semibold">
                  Host & Address
                </span>
                <span className="font-mono text-white text-sm font-bold">{raw}</span>
              </div>
              <div className="p-3 bg-[#0C0B12] border border-[#231E30]">
                <span className="text-[#8E87A3] block uppercase tracking-wider text-[10px] font-semibold">
                  Assigned Port
                </span>
                <span className="font-mono text-white text-sm font-bold">{port}</span>
              </div>
              <div className="p-3 bg-[#0C0B12] border border-[#231E30]">
                <span className="text-[#8E87A3] block uppercase tracking-wider text-[10px] font-semibold">
                  Compatibility
                </span>
                <span className="font-mono text-white text-sm font-bold">{siteConfig.supportedVersions}</span>
              </div>
              <div className="p-3 bg-[#0C0B12] border border-[#231E30]">
                <span className="text-[#8E87A3] block uppercase tracking-wider text-[10px] font-semibold">
                  Management & Oversight
                </span>
                <span className="font-mono text-white text-sm font-bold">{managerName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick CTA */}
        <div className="text-center pt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/features"
            className="mc-btn mc-btn-primary px-6 py-3 text-xs font-bold uppercase tracking-wider"
          >
            Explore In-Game Commands & Systems
          </Link>
          <Link
            to="/rules"
            className="mc-btn px-6 py-3 text-xs font-bold uppercase tracking-wider bg-[#1B1828] text-white border-[#3E384D]"
          >
            Review Server Guidelines
          </Link>
        </div>
      </div>
    </div>
  );
};
