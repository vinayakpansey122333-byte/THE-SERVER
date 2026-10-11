import React, { useState, useEffect } from 'react';
import { gameplayFeatures } from '../content/features';
import { GameplayFeature } from '../types';
import { DataBadge } from '../components/ui/DataBadge';
import { Dialog } from '../components/ui/Dialog';
import {
  getEffectiveBrandName,
} from '../config/siteConfig';
import {
  PickaxeIcon,
  SwordIcon,
  CoinIcon,
  TrophyIcon,
  ShieldIcon,
  UsersIcon,
} from '../components/ui/Icons';

export const Features: React.FC = () => {
  const brandName = getEffectiveBrandName();
  const [selectedFeature, setSelectedFeature] = useState<GameplayFeature | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    document.title = `Gameplay Features - ${brandName}`;
  }, [brandName]);

  const categories = ['all', 'Survival', 'Economy', 'Combat', 'Community', 'Ranks'];

  const filteredFeatures =
    activeCategory === 'all'
      ? gameplayFeatures
      : gameplayFeatures.filter((f) => f.category === activeCategory);

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'pickaxe':
        return <PickaxeIcon className="text-emerald-400" size={24} />;
      case 'sword':
        return <SwordIcon className="text-purple-400" size={24} />;
      case 'coin':
        return <CoinIcon className="text-amber-400" size={24} />;
      case 'trophy':
        return <TrophyIcon className="text-yellow-400" size={24} />;
      case 'users':
        return <UsersIcon className="text-blue-400" size={24} />;
      default:
        return <ShieldIcon className="text-emerald-400" size={24} />;
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-[#252033] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DataBadge state="CONFIGURED" />
              <span className="text-xs font-mono uppercase tracking-wider text-purple-300">
                In-Game Mechanics & Plug-ins
              </span>
            </div>
            <h1 className="font-pixel text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight">
              Gameplay Systems
            </h1>
            <p className="mt-2 text-sm text-[#B3ADCA] max-w-2xl leading-relaxed">
              Explore the foundational mechanics and commands designed for high-uptime, balanced survival multiplayer.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Feature categories">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeCategory === cat
                    ? 'bg-purple-900/60 text-white border border-purple-500/50'
                    : 'bg-[#14121B] text-[#A29DB3] hover:text-white border border-[#2B273A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feat) => (
            <div
              key={feat.id}
              className="mc-panel p-6 border-[#2B2639] bg-[#12101C] hover:border-[#4B4361] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-[#1A1726] border border-[#363047] group-hover:border-[#8E6BDB] transition-colors">
                    {getFeatureIcon(feat.icon)}
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#A29DB3] bg-[#161421] px-2 py-0.5 border border-[#262232]">
                    {feat.category}
                  </span>
                </div>

                <h2 className="font-pixel text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {feat.title}
                </h2>
                <p className="text-xs font-mono text-purple-300/80 mb-3">
                  {feat.tagline}
                </p>
                <p className="text-xs text-[#A29DB3] leading-relaxed mb-4">
                  {feat.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-1.5 text-xs text-[#C6C0D9] border-t border-[#1F1C2C] pt-3 mb-6">
                  {feat.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#1F1C2C] flex items-center justify-between">
                {feat.commandPreview ? (
                  <code className="text-[11px] font-mono text-emerald-400 bg-[#0C0B12] px-2 py-1 border border-[#231E30]">
                    {feat.commandPreview}
                  </code>
                ) : (
                  <span />
                )}
                <button
                  onClick={() => setSelectedFeature(feat)}
                  className="text-xs font-bold uppercase tracking-wider text-purple-300 hover:text-white underline"
                >
                  Learn Details &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Learn More Modal Dialog */}
        <Dialog
          isOpen={Boolean(selectedFeature)}
          onClose={() => setSelectedFeature(null)}
          title={selectedFeature?.title || 'Feature Details'}
        >
          {selectedFeature && (
            <div className="space-y-5 text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#252033]">
                <span className="text-xs font-mono uppercase tracking-wider text-purple-300">
                  Category: {selectedFeature.category}
                </span>
                <DataBadge state="CONFIGURED" />
              </div>

              <p className="text-[#ECE9F5] leading-relaxed">
                {selectedFeature.description}
              </p>

              <div>
                <h4 className="font-pixel text-white text-sm font-bold uppercase mb-2">
                  System Capabilities & Highlights
                </h4>
                <ul className="space-y-2 text-xs text-[#C6C0D9] bg-[#0E0C16] p-4 border border-[#252135]">
                  {selectedFeature.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedFeature.commandPreview && (
                <div className="p-3 bg-[#0E0C16] border border-[#252135] text-xs">
                  <span className="text-[#8E87A3] uppercase tracking-wider text-[10px] font-bold block mb-1">
                    Primary Commands
                  </span>
                  <code className="text-emerald-400 font-mono text-sm block">
                    {selectedFeature.commandPreview}
                  </code>
                </div>
              )}

              <div className="pt-2 text-xs text-[#8E87A3]">
                Available to all players upon connecting to the server. No paywall or hidden unlock requirements.
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </div>
  );
};
