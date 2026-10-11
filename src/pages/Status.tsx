import React, { useState, useEffect, useRef } from 'react';
import { fetchServerStatus } from '../lib/apiAdapters';
import { ServerStatusData, DataSourceState } from '../types';
import { DataBadge } from '../components/ui/DataBadge';
import {
  siteConfig,
  getEffectiveBrandName,
  getEffectiveServerAddress,
  isPlaceholder,
} from '../config/siteConfig';
import { useToast } from '../components/ui/Toast';

export const Status: React.FC = () => {
  const brandName = getEffectiveBrandName();
  const { host, port, raw } = getEffectiveServerAddress();
  const { addToast } = useToast();

  const [status, setStatus] = useState<ServerStatusData | null>(null);
  const [dataState, setDataState] = useState<DataSourceState>('LOADING');
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'java' | 'bedrock'>('java');

  const abortControllerRef = useRef<AbortController | null>(null);

  const isConfigured = !isPlaceholder(raw);

  const queryStatus = (isManual = false) => {
    if (!isConfigured) {
      setDataState('UNAVAILABLE');
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (isManual) setIsRefreshing(true);
    else setDataState('LOADING');

    fetchServerStatus(controller.signal)
      .then((res) => {
        if (res.state === 'LIVE' && res.data) {
          setStatus(res.data);
          setDataState('LIVE');
          setLastFetchedAt(res.fetchedAt || Date.now());
          setErrorMessage(null);
          if (isManual) addToast('Server status refreshed!', 'success');
        } else if (res.state === 'UNAVAILABLE') {
          setDataState('UNAVAILABLE');
          setErrorMessage(res.error || 'Server address not configured');
        } else {
          // If we had old data older than 5 minutes, mark STALE
          if (lastFetchedAt && Date.now() - lastFetchedAt > 5 * 60 * 1000) {
            setDataState('STALE');
          } else {
            setDataState('ERROR');
          }
          setErrorMessage(res.error || 'Failed to ping Minecraft server endpoint');
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setDataState('ERROR');
          setErrorMessage(err.message || 'Network error querying server provider');
        }
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    document.title = `Server Status & Telemetry - ${brandName}`;
    queryStatus();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      queryStatus();
    }, 60000);

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [raw]);

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-[#252033] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DataBadge state={dataState} />
              <span className="text-xs font-mono uppercase tracking-wider text-purple-300">
                Direct Ping Telemetry
              </span>
            </div>
            <h1 className="font-pixel text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight">
              Network Status
            </h1>
            <p className="mt-2 text-sm text-[#B3ADCA] max-w-xl leading-relaxed">
              Real-time server connectivity, active player counts, ping latency, and protocol compatibility.
            </p>
          </div>

          <button
            onClick={() => queryStatus(true)}
            disabled={isRefreshing}
            className="mc-btn px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1B1828] hover:bg-[#252037] text-white border-[#3E384D] flex items-center gap-2 self-start md:self-auto disabled:opacity-50"
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${isRefreshing ? 'animate-ping' : ''}`} />
            <span>{isRefreshing ? 'Pinging Node...' : 'Manual Refresh'}</span>
          </button>
        </div>

        {/* Maintenance Banner if maintenanceMode is active */}
        {siteConfig.maintenanceMode && (
          <div className="p-4 bg-amber-950/80 border border-amber-500/60 text-amber-200 text-xs">
            <strong>Maintenance Active:</strong> {siteConfig.maintenanceMessage}
          </div>
        )}

        {/* Platform Edition Selector Tabs */}
        <div className="flex border-b border-[#252033]" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'java'}
            onClick={() => setActiveTab('java')}
            className={`px-4 py-2 text-xs font-bold font-pixel uppercase tracking-wider ${
              activeTab === 'java'
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-950/20'
                : 'text-[#A29DB3] hover:text-white'
            }`}
          >
            Java Edition Node
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'bedrock'}
            onClick={() => setActiveTab('bedrock')}
            className={`px-4 py-2 text-xs font-bold font-pixel uppercase tracking-wider ${
              activeTab === 'bedrock'
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-950/20'
                : 'text-[#A29DB3] hover:text-white'
            }`}
          >
            Bedrock Edition Gateway
          </button>
        </div>

        {/* Main Status Telemetry Card */}
        <div className="mc-panel p-6 sm:p-8 border-[#322D42] bg-[#13111F] space-y-8">
          {/* Top Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#252135]">
            <div className="flex items-center gap-3">
              <span
                className={`w-3.5 h-3.5 rounded-full ${
                  dataState === 'LOADING'
                    ? 'bg-amber-400 animate-pulse'
                    : status?.online
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-red-500'
                }`}
              />
              <div>
                <h2 className="font-pixel text-2xl font-bold text-white uppercase">
                  {dataState === 'LOADING'
                    ? 'Connecting to Node...'
                    : status?.online
                    ? 'Operational (Online)'
                    : 'Server Unreachable / Offline'}
                </h2>
                <span className="font-mono text-xs text-[#8E87A3]">
                  Host: {raw}
                </span>
              </div>
            </div>

            <div className="font-mono text-right text-xs">
              <span className="text-[#8E87A3] block uppercase text-[10px]">Active Players:</span>
              <span className="font-bold text-lg text-emerald-400">
                {status?.players ? `${status.players.online} / ${status.players.max}` : '—'}
              </span>
            </div>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#0D0B14] border border-[#252033]">
              <span className="text-[#7B758E] block uppercase text-[10px] mb-1">
                Ping / Latency
              </span>
              <span className="text-sm font-bold text-emerald-400">
                {status?.ping ? `${status.ping} ms` : '—'}
              </span>
            </div>

            <div className="p-3 bg-[#0D0B14] border border-[#252033]">
              <span className="text-[#7B758E] block uppercase text-[10px] mb-1">
                Version Compatibility
              </span>
              <span className="text-sm font-bold text-white truncate block">
                {status?.version?.name || siteConfig.supportedVersions}
              </span>
            </div>

            <div className="p-3 bg-[#0D0B14] border border-[#252033]">
              <span className="text-[#7B758E] block uppercase text-[10px] mb-1">
                Port Allocation
              </span>
              <span className="text-sm font-bold text-purple-300">
                {activeTab === 'java' ? port : siteConfig.bedrockPort || 19132}
              </span>
            </div>

            <div className="p-3 bg-[#0D0B14] border border-[#252033]">
              <span className="text-[#7B758E] block uppercase text-[10px] mb-1">
                Provider API
              </span>
              <span className="text-sm font-bold text-white uppercase">
                {isPlaceholder(siteConfig.statusProvider) ? 'mcstatus.io' : siteConfig.statusProvider}
              </span>
            </div>
          </div>

          {/* MOTD Display Box */}
          <div className="p-4 bg-[#0A0910] border border-[#201C2C] space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#7B758E] font-bold block">
              Server MOTD (Message of the Day):
            </span>
            <p className="font-mono text-sm text-[#D8D2EB] whitespace-pre-wrap leading-relaxed">
              {status?.motd?.clean || (status?.online ? 'Welcome to The Server!' : 'No response from host.')}
            </p>
          </div>

          {/* Player List (if returned by server ping) */}
          {status?.players?.list && status.players.list.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#A29DB3] block font-bold">
                Online Players Sample ({status.players.list.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {status.players.list.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-[#191526] border border-[#312B42] text-xs font-mono text-purple-200"
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Error Details if any */}
          {errorMessage && dataState === 'ERROR' && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono">
              <strong>Error Trace:</strong> {errorMessage}
            </div>
          )}

          {/* Timestamp footer */}
          <div className="pt-4 border-t border-[#231F32] flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono text-[#7B758E] gap-2">
            <span>
              Last fetched:{' '}
              {lastFetchedAt
                ? new Date(lastFetchedAt).toLocaleTimeString()
                : 'Pending response'}
            </span>
            <span>Queries refresh automatically every 60s.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
