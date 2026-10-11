import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { CopyIcon, CheckIcon } from './Icons';
import { copyToClipboard } from '../../lib/clipboard';
import { useToast } from './Toast';
import { getEffectiveServerAddress, siteConfig } from '../../config/siteConfig';

interface JoinDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinDialog: React.FC<JoinDialogProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'java' | 'bedrock'>('java');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { addToast } = useToast();
  const { host, port, raw } = getEffectiveServerAddress();

  const handleCopy = async (text: string, label: string, key: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      addToast(`Copied ${label} to clipboard!`, 'success');
      setTimeout(() => setCopiedKey(null), 2000);
    } else {
      addToast(`Failed to copy ${label}`, 'error');
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="How to Join The Server" maxWidth="max-w-2xl">
      {/* Server Header Banner */}
      <div className="flex items-center gap-3 p-3 mb-5 bg-[#120F1D] border border-[#2D283C] rounded-lg">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-emerald-400/90 shadow flex-shrink-0">
          <img src="/server_logo.jpg" alt="Server Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <span className="font-pixel text-sm font-bold text-white block">Official Multiplayer Connection</span>
          <span className="text-[11px] font-mono text-emerald-400">heaven.caspian.host:40704 &bull; 1.20 - 1.21.x</span>
        </div>
      </div>

      {/* Platform Switcher Tabs */}
      <div className="flex border-b border-[#26232E] mb-6" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'java'}
          onClick={() => setActiveTab('java')}
          className={`px-4 py-2.5 text-sm font-bold font-pixel tracking-wider uppercase transition-colors ${
            activeTab === 'java'
              ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-950/20'
              : 'text-[#A29DB3] hover:text-white'
          }`}
        >
          Java Edition (PC / Mac)
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'bedrock'}
          onClick={() => setActiveTab('bedrock')}
          className={`px-4 py-2.5 text-sm font-bold font-pixel tracking-wider uppercase transition-colors ${
            activeTab === 'bedrock'
              ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-950/20'
              : 'text-[#A29DB3] hover:text-white'
          }`}
        >
          Bedrock Edition (Mobile / Console / Windows)
        </button>
      </div>

      {activeTab === 'java' && (
        <div className="space-y-6">
          {/* IP Copy Box */}
          <div className="mc-panel-highlight p-4 border border-[#3D384D] bg-[#161322]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#A29DB3] font-semibold block">
                  Server Address (IP:Port)
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-white selection:bg-[#8E6BDB]">
                  {raw}
                </span>
              </div>
              <button
                onClick={() => handleCopy(raw, 'Server IP', 'java-ip')}
                className="mc-btn mc-btn-primary px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-stretch sm:self-auto justify-center"
              >
                {copiedKey === 'java-ip' ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                {copiedKey === 'java-ip' ? 'Copied IP!' : 'Copy IP Address'}
              </button>
            </div>
            <div className="mt-2 text-xs text-[#A29DB3] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#8E6BDB]" />
              <span>Supported Versions: <strong>{siteConfig.supportedVersions}</strong></span>
            </div>
          </div>

          {/* Steps */}
          <ol className="space-y-3 text-sm text-[#ECE9F5]">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#26232E] border border-[#3E384D] flex items-center justify-center font-bold text-xs text-purple-300">
                1
              </span>
              <div>
                <strong>Launch Minecraft Java Edition:</strong> Start your launcher and verify you are running a supported release ({siteConfig.supportedVersions}).
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#26232E] border border-[#3E384D] flex items-center justify-center font-bold text-xs text-purple-300">
                2
              </span>
              <div>
                <strong>Navigate to Multiplayer:</strong> Select <em>Multiplayer</em> from the title screen, then click <em>Add Server</em>.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#26232E] border border-[#3E384D] flex items-center justify-center font-bold text-xs text-purple-300">
                3
              </span>
              <div>
                <strong>Paste Server Address:</strong> Paste <code className="bg-[#26232E] px-1.5 py-0.5 text-emerald-300">{raw}</code> into the Server Address box and click <em>Done</em>.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#26232E] border border-[#3E384D] flex items-center justify-center font-bold text-xs text-purple-300">
                4
              </span>
              <div>
                <strong>Join Server:</strong> Double-click the server listing to enter the world!
              </div>
            </li>
          </ol>
        </div>
      )}

      {activeTab === 'bedrock' && (
        <div className="space-y-6">
          <div className="mc-panel-highlight p-4 border border-[#3D384D] bg-[#161322] space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#A29DB3] font-semibold block">
                  Server Host (Bedrock IP)
                </span>
                <span className="font-mono text-base font-bold text-white">
                  {host}
                </span>
              </div>
              <button
                onClick={() => handleCopy(host, 'Bedrock Host', 'bedrock-host')}
                className="mc-btn mc-btn-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                {copiedKey === 'bedrock-host' ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                {copiedKey === 'bedrock-host' ? 'Copied!' : 'Copy Host'}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-[#26232E]">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#A29DB3] font-semibold block">
                  Bedrock Port
                </span>
                <span className="font-mono text-base font-bold text-white">
                  {port || siteConfig.bedrockPort || 19132}
                </span>
              </div>
              <button
                onClick={() => handleCopy(String(port || siteConfig.bedrockPort || 19132), 'Bedrock Port', 'bedrock-port')}
                className="mc-btn mc-btn-amethyst px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                {copiedKey === 'bedrock-port' ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                {copiedKey === 'bedrock-port' ? 'Copied!' : 'Copy Port'}
              </button>
            </div>
          </div>

          {/* Bedrock Steps */}
          <ol className="space-y-3 text-sm text-[#ECE9F5]">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#26232E] border border-[#3E384D] flex items-center justify-center font-bold text-xs text-emerald-300">
                1
              </span>
              <div>
                <strong>Open Minecraft Bedrock:</strong> On your console, Windows, iOS, or Android device.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#26232E] border border-[#3E384D] flex items-center justify-center font-bold text-xs text-emerald-300">
                2
              </span>
              <div>
                <strong>Go to Servers tab:</strong> Click <em>Play</em>, switch to the <em>Servers</em> tab, and scroll to the bottom to click <em>Add Server</em>.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#26232E] border border-[#3E384D] flex items-center justify-center font-bold text-xs text-emerald-300">
                3
              </span>
              <div>
                <strong>Enter Details:</strong> Name the server, paste host <code className="bg-[#26232E] px-1.5 text-emerald-300">{host}</code> and port <code className="bg-[#26232E] px-1.5 text-emerald-300">{port}</code>, then click <em>Play</em>.
              </div>
            </li>
          </ol>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-[#26232E] flex items-center justify-between text-xs text-[#A29DB3]">
        <span>Need help connecting?</span>
        <a
          href={siteConfig.discordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-300 hover:text-white underline font-semibold"
        >
          Join Discord Support
        </a>
      </div>
    </Dialog>
  );
};
