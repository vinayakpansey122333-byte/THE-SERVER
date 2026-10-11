import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ruleCategories, rulesLastUpdated, rulesSource } from '../content/rules';
import { DataBadge } from '../components/ui/DataBadge';
import {
  getEffectiveBrandName,
  getEffectiveDiscordUrl,
} from '../config/siteConfig';
import { ShieldIcon, DiscordIcon, CopyIcon, CheckIcon } from '../components/ui/Icons';
import { copyToClipboard } from '../lib/clipboard';
import { useToast } from '../components/ui/Toast';

export const Rules: React.FC = () => {
  const brandName = getEffectiveBrandName();
  const discordUrl = getEffectiveDiscordUrl();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    cheating: true,
    exploits: true,
    chat: true,
    spam: true,
    trading: true,
    accounts: true,
  });
  const [copiedAnchor, setCopiedAnchor] = useState<string | null>(null);
  const location = useLocation();
  const { addToast } = useToast();

  useEffect(() => {
    document.title = `Server Rules & Guidelines - ${brandName}`;

    // Handle deep-link anchor scroll
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    }
  }, [brandName, location.hash]);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyAnchor = async (ruleId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${ruleId}`;
    const success = await copyToClipboard(url);
    if (success) {
      setCopiedAnchor(ruleId);
      addToast('Copied rule direct link to clipboard!', 'success');
      setTimeout(() => setCopiedAnchor(null), 2000);
    }
  };

  // Filter categories and rules by search query
  const filteredCategories = ruleCategories
    .map((cat) => {
      const filteredRules = cat.rules.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.number.includes(searchQuery)
      );
      return {
        ...cat,
        rules: filteredRules,
      };
    })
    .filter((cat) => cat.rules.length > 0);

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-[#252033] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DataBadge
                state={rulesSource === 'configured' ? 'CONFIGURED' : 'SAMPLE'}
                customLabel={rulesSource === 'sample' ? 'SAMPLE RULES – REPLACE BEFORE LAUNCH' : undefined}
              />
              <span className="text-xs font-mono uppercase tracking-wider text-purple-300">
                Last Updated: {rulesLastUpdated}
              </span>
            </div>
            <h1 className="font-pixel text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight">
              Server Guidelines & Rules
            </h1>
            <p className="mt-2 text-sm text-[#B3ADCA] max-w-2xl leading-relaxed">
              Every player on {brandName} is bound by these community standards upon connecting. Ignorance of the rules is not an acceptable excuse for violations.
            </p>
          </div>

          {/* Quick search input */}
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search rules (e.g. X-Ray, RMT)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#12101C] border border-[#2F293E] text-white placeholder-[#78728A] focus:outline-none focus:border-[#8E6BDB]"
            />
          </div>
        </div>

        {/* Notice for sample rules if applicable */}
        {rulesSource === 'sample' && (
          <div className="p-4 bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs">
            <strong>Sample Rules:</strong> These rules are template placeholders. Review and customize them in <code>src/content/rules.ts</code> to match your network policies.
          </div>
        )}

        {/* Categories Accordions */}
        <div className="space-y-6">
          {filteredCategories.map((cat) => {
            const isExpanded = expandedCategories[cat.id] ?? true;

            return (
              <div
                key={cat.id}
                className="mc-panel border-[#2A2538] bg-[#12101C] overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  aria-expanded={isExpanded}
                  className="w-full p-5 text-left flex items-center justify-between bg-[#151221] hover:bg-[#1A1628] transition-colors border-b border-[#242031]"
                >
                  <div>
                    <h2 className="font-pixel text-xl sm:text-2xl font-bold text-white">
                      {cat.title}
                    </h2>
                    <p className="text-xs text-[#A29DB3] mt-0.5">{cat.description}</p>
                  </div>
                  <span className="p-1 text-purple-300 font-mono text-lg">
                    {isExpanded ? '−' : '+'}
                  </span>
                </button>

                {/* Category Rule Items */}
                {isExpanded && (
                  <div className="p-6 space-y-6 divide-y divide-[#201C2D]">
                    {cat.rules.map((rule, idx) => (
                      <div
                        key={rule.id}
                        id={rule.id}
                        className={`pt-6 first:pt-0 transition-colors ${
                          location.hash === `#${rule.id}` ? 'bg-[#1D182E]/50 p-4 rounded' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-pixel text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-sm">
                              {rule.number}
                            </span>
                            <span>{rule.title}</span>
                          </h3>
                          <button
                            onClick={() => handleCopyAnchor(rule.id)}
                            className="text-[#7E7791] hover:text-white p-1"
                            title="Copy deep link to this rule"
                            aria-label={`Copy link to rule ${rule.number}`}
                          >
                            {copiedAnchor === rule.id ? (
                              <CheckIcon size={14} className="text-emerald-400" />
                            ) : (
                              <CopyIcon size={14} />
                            )}
                          </button>
                        </div>

                        <p className="text-xs sm:text-sm text-[#D7D2E8] leading-relaxed mb-3">
                          {rule.description}
                        </p>

                        {/* Examples */}
                        {rule.examples && rule.examples.length > 0 && (
                          <div className="mb-3 p-3 bg-[#0C0B12] border border-[#231E30] text-xs">
                            <span className="text-[#8E87A3] text-[10px] font-bold uppercase tracking-wider block mb-1">
                              Violative Examples:
                            </span>
                            <ul className="text-[#A29DB3] space-y-0.5 list-disc list-inside">
                              {rule.examples.map((ex, exIdx) => (
                                <li key={exIdx}>{ex}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Punishment */}
                        <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-300 bg-amber-950/40 px-2.5 py-1 border border-amber-600/30">
                          <span className="font-bold text-amber-400 uppercase text-[10px]">
                            Consequence:
                          </span>
                          <span>{rule.punishment}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Appeals & Contact Section */}
        <div className="mc-panel p-8 border-[#3A334B] bg-[#141120] text-center space-y-4">
          <div className="w-12 h-12 bg-[#211C30] border border-[#433B5B] flex items-center justify-center mx-auto text-purple-300">
            <ShieldIcon size={24} />
          </div>
          <h2 className="font-pixel text-2xl sm:text-3xl font-bold text-white uppercase">
            Disciplinary Appeals Process
          </h2>
          <p className="text-xs sm:text-sm text-[#A29DB3] max-w-xl mx-auto leading-relaxed">
            If you were muted or banned and believe an error occurred, or have completed an honest period of reflection, submit an official appeal. Trolling or harassing staff will forfeit your right to appeal.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/community#contact-form"
              className="mc-btn mc-btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
            >
              Submit Web Ban Appeal
            </Link>
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mc-btn px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-[#8EA2FF] border-[#5865F2]/40 flex items-center gap-2"
            >
              <DiscordIcon size={16} />
              <span>Open Discord Ticket</span>
            </a>
            <Link
              to="/assistant"
              className="mc-btn px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#1B1828] text-purple-300 border-[#3E384D]"
            >
              Review with AI Appeal Assistant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
