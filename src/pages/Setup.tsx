import React, { useEffect, useState } from 'react';
import { getPlaceholderAudits } from '../config/siteConfig';
import { DataBadge } from '../components/ui/DataBadge';
import { copyToClipboard } from '../lib/clipboard';
import { useToast } from '../components/ui/Toast';
import { CopyIcon, CheckIcon } from '../components/ui/Icons';

export const Setup: React.FC = () => {
  const audits = getPlaceholderAudits();
  const unconfiguredCount = audits.filter((a) => !a.isConfigured).length;
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    document.title = 'Setup Mode & Configuration Audit';
  }, []);

  const handleCopy = async (text: string, label: string, key: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      addToast(`Copied ${label} to clipboard!`, 'success');
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-[#252033] pb-8">
          <div className="flex items-center gap-2 mb-2">
            <DataBadge
              state={unconfiguredCount > 0 ? 'SAMPLE' : 'LIVE'}
              customLabel={unconfiguredCount > 0 ? `SETUP MODE (${unconfiguredCount} PENDING)` : 'ALL CONFIGURED'}
            />
            <span className="text-xs font-mono uppercase tracking-wider text-purple-300">
              Central Architecture Audit
            </span>
          </div>
          <h1 className="font-pixel text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight">
            Server Setup & Configuration Guide
          </h1>
          <p className="mt-2 text-sm text-[#B3ADCA] max-w-2xl leading-relaxed">
            This page audits all public parameters and placeholder tokens defined in <code>src/config/siteConfig.ts</code>. As per our honesty protocol, unconfigured placeholders are never masked.
          </p>
        </div>

        {/* Overview Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="mc-panel p-4 border-[#2F293E] bg-[#13111E]">
            <span className="text-[#8E87A3] block uppercase text-[10px] mb-1">Total Audit Tokens</span>
            <span className="text-2xl font-bold text-white font-pixel">{audits.length} Items</span>
          </div>
          <div className="mc-panel p-4 border-[#2F293E] bg-[#13111E]">
            <span className="text-[#8E87A3] block uppercase text-[10px] mb-1">Configured Values</span>
            <span className="text-2xl font-bold text-emerald-400 font-pixel">
              {audits.length - unconfiguredCount} Ready
            </span>
          </div>
          <div className="mc-panel p-4 border-[#2F293E] bg-[#13111E]">
            <span className="text-[#8E87A3] block uppercase text-[10px] mb-1">Unresolved Placeholders</span>
            <span className={`text-2xl font-bold font-pixel ${unconfiguredCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {unconfiguredCount} Pending
            </span>
          </div>
        </div>

        {/* Step-by-Step Edit Guide */}
        <div className="mc-panel p-6 border-[#363047] bg-[#151221] space-y-3 text-xs leading-relaxed">
          <h2 className="font-pixel text-xl font-bold text-white uppercase">
            How to Edit Content & Replace Placeholders
          </h2>
          <ol className="space-y-1.5 list-decimal list-inside text-[#D0CBE0]">
            <li>
              Open <code className="bg-[#241F33] px-1.5 py-0.5 text-purple-200">src/config/siteConfig.ts</code> in your code editor.
            </li>
            <li>
              Search for any token matching <code className="bg-[#241F33] px-1.5 py-0.5 text-purple-200">[[...]]</code> and replace it with your real server details.
            </li>
            <li>
              To customize specific gameplay items or rules, edit the corresponding files in <code className="bg-[#241F33] px-1.5 py-0.5 text-purple-200">src/content/*.ts</code>.
            </li>
            <li>
              Once critical placeholders are filled, the setup mode banner automatically disappears.
            </li>
          </ol>
        </div>

        {/* Audit Table */}
        <div className="mc-panel border-[#2B2639] bg-[#12101C] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181524] border-b border-[#2B2639] text-[#A29DB3] font-mono uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Setting / Field</th>
                <th className="py-3 px-4">Placeholder Token</th>
                <th className="py-3 px-4">Current Value</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1C2B]">
              {audits.map((item) => (
                <tr key={item.key} className="hover:bg-[#1A1728] transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{item.label}</span>
                    <span className="text-[11px] text-[#8E87A3] mt-0.5 block max-w-xs">
                      {item.description}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-purple-300">
                    <code className="bg-[#1D182A] px-1.5 py-0.5 border border-[#312B42]">
                      {item.placeholderValue}
                    </code>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-white max-w-xs truncate">
                    {item.currentValue || '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <DataBadge
                      state={item.isConfigured ? 'CONFIGURED' : 'UNAVAILABLE'}
                      customLabel={item.isConfigured ? 'CONFIGURED' : 'UNRESOLVED'}
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() =>
                        handleCopy(item.placeholderValue, item.label, item.key)
                      }
                      className="mc-btn px-2.5 py-1 text-[11px] font-mono bg-[#1B1728] hover:bg-[#252037] text-purple-200 border-[#3E384D] inline-flex items-center gap-1.5"
                      title="Copy placeholder token to clipboard"
                    >
                      {copiedKey === item.key ? (
                        <CheckIcon size={12} className="text-emerald-400" />
                      ) : (
                        <CopyIcon size={12} />
                      )}
                      <span>Copy</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
