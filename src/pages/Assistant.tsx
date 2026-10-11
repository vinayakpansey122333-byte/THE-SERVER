import React, { useState, useEffect } from 'react';
import { askGeminiAssistant } from '../lib/geminiService';
import { DataBadge } from '../components/ui/DataBadge';
import {
  getEffectiveBrandName,
  getEffectiveServerAddress,
} from '../config/siteConfig';
import { SparklesIcon } from '../components/ui/Icons';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  thinkingUsed?: boolean;
  searchGrounded?: boolean;
  timestamp: string;
}

export const Assistant: React.FC = () => {
  const brandName = getEffectiveBrandName();
  const { raw } = getEffectiveServerAddress();

  const [inputMessage, setInputMessage] = useState<string>('');
  const [useThinking, setUseThinking] = useState<boolean>(false);
  const [useSearch, setUseSearch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am the automated Rule & Command Assistant for ${brandName} (connecting to ${raw}). How can I assist you today? You can ask about server commands (/claim, /sethome, /shop), evaluate an appeal draft against our server rules, or query Minecraft survival mechanics.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    document.title = `AI Server Assistant - ${brandName}`;
  }, [brandName]);

  const handleSubmit = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const promptToSend = customPrompt || inputMessage;
    if (!promptToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: promptToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await askGeminiAssistant({
        message: promptToSend.trim(),
        useThinking,
        useSearch,
      });

      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'assistant',
        text: response.reply,
        thinkingUsed: response.thinkingUsed,
        searchGrounded: response.searchGrounded,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      setErrorMessage((err as Error)?.message || 'Failed to communicate with AI endpoint.');
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    {
      label: 'How do land claims work?',
      prompt: 'How do I claim land on this server using a golden shovel and what sub-claims can I create?',
    },
    {
      label: 'Evaluate my ban appeal',
      prompt: 'Can you critique this ban appeal draft: "I was banned for using an auto-clicker at a mob farm. I understand AFK macroing is against Rule 1.2 and I have removed the software. Can my ban be reconsidered?"',
      thinking: true,
    },
    {
      label: '1.21 Trial Chambers Guide',
      prompt: 'What are the main rewards and strategies for conquering Trial Chambers and getting the heavy core in Minecraft 1.21?',
      search: true,
    },
    {
      label: 'Auction House (/ah) rules',
      prompt: 'How does the player-driven Auction House work, and is renaming items to deceive buyers allowed?',
    },
  ];

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-[#252033] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DataBadge state="LIVE" customLabel="GEMINI INTELLIGENCE" />
              <span className="text-xs font-mono uppercase tracking-wider text-purple-300">
                Server Assistant & Command Helper
              </span>
            </div>
            <h1 className="font-pixel text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <SparklesIcon className="text-purple-400" size={36} />
              AI Rule & Command Helper
            </h1>
            <p className="mt-2 text-sm text-[#B3ADCA] max-w-2xl leading-relaxed">
              Powered by server-side Gemini intelligence. Ask questions about server rules, evaluate disciplinary appeal drafts, or learn in-game commands.
            </p>
          </div>
        </div>

        {/* Feature Pill Settings */}
        <div className="mc-panel p-4 border-[#302A41] bg-[#14121F] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            {/* Thinking Mode Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-[#ECE9F5]">
              <input
                type="checkbox"
                checked={useThinking}
                onChange={(e) => {
                  setUseThinking(e.target.checked);
                  if (e.target.checked) setUseSearch(false);
                }}
                className="rounded-none accent-[#8E6BDB]"
              />
              <span className="font-bold">Deep Reasoning / High Thinking</span>
              <span className="text-[10px] text-purple-300 font-mono">(gemini-3.1-pro-preview)</span>
            </label>

            {/* Search Grounding Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-[#ECE9F5]">
              <input
                type="checkbox"
                checked={useSearch}
                onChange={(e) => {
                  setUseSearch(e.target.checked);
                  if (e.target.checked) setUseThinking(false);
                }}
                className="rounded-none accent-[#3DDC84]"
              />
              <span className="font-bold">Search Grounding</span>
              <span className="text-[10px] text-emerald-300 font-mono">(Google Search)</span>
            </label>
          </div>

          <span className="text-[#7A758C] font-mono text-[11px]">
            Server-side encrypted proxy
          </span>
        </div>

        {/* Suggested Prompts */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-[#A29DB3] font-semibold block">
            Suggested Quick Queries:
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (p.thinking) setUseThinking(true);
                  if (p.search) setUseSearch(true);
                  handleSubmit(undefined, p.prompt);
                }}
                className="mc-btn px-3 py-1.5 text-xs bg-[#171424] hover:bg-[#231E35] text-[#D8D2EB] border-[#372F4C] text-left"
              >
                &bull; {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Stream Window */}
        <div className="mc-panel border-[#2B2639] bg-[#100E1A] p-4 sm:p-6 min-h-[420px] max-h-[600px] overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] p-4 text-xs sm:text-sm leading-relaxed border ${
                  msg.sender === 'user'
                    ? 'bg-[#251E38] border-[#4E3F6E] text-white shadow-md'
                    : 'bg-[#151221] border-[#2A243A] text-[#ECE9F5]'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-white/10 text-[10px] font-mono text-[#A29DB3]">
                  <span className="font-bold uppercase tracking-wider">
                    {msg.sender === 'user' ? 'You' : 'Server Assistant'}
                  </span>
                  <div className="flex items-center gap-2">
                    {msg.thinkingUsed && (
                      <span className="px-1.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-500/40">
                        High Thinking
                      </span>
                    )}
                    {msg.searchGrounded && (
                      <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                        Search Grounded
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start">
              <div className="p-4 bg-[#151221] border border-[#2A243A] text-xs font-mono text-purple-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>
                  {useThinking
                    ? 'Thinking deeply and analyzing server policies...'
                    : useSearch
                    ? 'Retrieving latest web information...'
                    : 'Generating response...'}
                </span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-950/70 border border-red-500/50 text-red-200 text-xs font-mono">
              <strong>Error:</strong> {errorMessage}
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => handleSubmit(e)} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about server rules, commands, or paste an appeal draft..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-[#12101C] border border-[#2F293E] text-white placeholder-[#78728A] focus:outline-none focus:border-[#8E6BDB] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="mc-btn mc-btn-amethyst px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
