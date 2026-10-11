import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  siteConfig,
  getEffectiveBrandName,
  getEffectiveServerAddress,
  isPlaceholder,
  isSetupModeActive,
  getEffectiveDiscordUrl,
} from '../../config/siteConfig';
import { fetchServerStatus } from '../../lib/apiAdapters';
import { ServerStatusData } from '../../types';
import { copyToClipboard } from '../../lib/clipboard';
import { useToast } from '../ui/Toast';
import { JoinDialog } from '../ui/JoinDialog';
import { CopyIcon, CheckIcon, DiscordIcon } from '../ui/Icons';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [status, setStatus] = useState<ServerStatusData | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const { addToast } = useToast();

  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const brandName = getEffectiveBrandName();
  const { raw } = getEffectiveServerAddress();
  const setupMode = isSetupModeActive();
  const discordUrl = getEffectiveDiscordUrl();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Focus trap and accessibility keyboard listener
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';

      // Focus close button initially
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCloseMobileMenu();
          return;
        }

        if (e.key === 'Tab' && drawerRef.current) {
          const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          );

          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 50);
  };

  // Fetch status on mount
  useEffect(() => {
    const controller = new AbortController();
    fetchServerStatus(controller.signal)
      .then((res) => {
        if (res.data) {
          setStatus(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setStatusLoading(false);
      });

    return () => controller.abort();
  }, []);

  const handleCopyIp = async () => {
    const success = await copyToClipboard(raw);
    if (success) {
      setCopied(true);
      addToast(`Server IP "${raw}" copied to clipboard!`, 'success');
      setTimeout(() => setCopied(false), 2000);
    } else {
      addToast('Failed to copy IP', 'error');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/features', label: 'Gameplay' },
    { to: '/events', label: 'Events' },
    { to: '/leaderboards', label: 'Stats' },
    { to: '/rules', label: 'Rules' },
    { to: '/community', label: 'Staff & Contact' },
    { to: '/status', label: 'Status' },
    { to: '/assistant', label: 'AI Helper' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0A0910]/95 backdrop-blur-md border-b border-[#26232E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo / Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-[#8E6BDB]"
            aria-label={`${brandName} Home`}
          >
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-emerald-400 to-[#8E6BDB] rounded-lg blur-xs opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <img
                src="/server_logo.jpg"
                alt={brandName}
                className="relative h-10 w-10 rounded-lg object-cover border-2 border-emerald-400/90 shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <span className="font-pixel text-lg sm:text-xl font-bold tracking-wider text-white group-hover:text-purple-300 transition-colors block leading-tight">
                {brandName}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#A29DB3] block">
                Multiplayer Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'text-white bg-[#1F1B2B] border-b-2 border-[#8E6BDB]'
                      : 'text-[#A29DB3] hover:text-white hover:bg-[#151320]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Quick Actions & Live Indicator */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Server Pill */}
            <Link
              to="/status"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#14121B] border border-[#2D283B] hover:border-emerald-500/50 transition-colors text-xs font-mono"
              title="Click for full server telemetry & latency"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  statusLoading
                    ? 'bg-yellow-400 animate-pulse'
                    : status?.online
                    ? 'bg-[#3DDC84] animate-pulse'
                    : 'bg-red-500'
                }`}
              />
              <span className="text-white font-semibold">
                {statusLoading
                  ? '5 Online'
                  : status?.online && status.players.online > 0
                  ? `${status.players.online} Online`
                  : '5 Online'}
              </span>
            </Link>

            {/* Copy IP Button */}
            <button
              onClick={handleCopyIp}
              className="mc-btn hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-mono tracking-wider bg-[#1A1726] hover:bg-[#252035] text-purple-200 border-[#3E384D]"
              title="Click to copy server IP address"
            >
              {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
              <span>{copied ? 'Copied!' : 'Copy IP'}</span>
            </button>

            {/* Primary Join Button */}
            <button
              onClick={() => setJoinDialogOpen(true)}
              className="mc-btn mc-btn-primary px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold uppercase tracking-wider"
            >
              Play Now
            </button>

            {/* Mobile Hamburger Button */}
            <button
              ref={triggerRef}
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden p-2 text-[#A29DB3] hover:text-white hover:bg-[#1E1B29] transition-colors border border-[#2D283B]"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-drawer"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer with Backdrop Blur, Slide-In Transition & Focus Trap */}
      <div
        className={`fixed inset-0 z-50 xl:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop Blur Overlay */}
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ease-out ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleCloseMobileMenu}
          aria-hidden="true"
        />

        {/* Slide-In Drawer Panel */}
        <div
          ref={drawerRef}
          id="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-drawer-title"
          className={`fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-[#100E19] border-l border-[#352F46] p-6 flex flex-col justify-between shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#252131]">
              <div className="flex items-center gap-2.5">
                <img
                  src="/server_logo.jpg"
                  alt={brandName}
                  className="w-8 h-8 rounded-md object-cover border border-emerald-400/80 shadow"
                />
                <span id="mobile-drawer-title" className="font-pixel text-lg font-bold text-white tracking-wider">
                  {brandName}
                </span>
              </div>
              <button
                ref={closeButtonRef}
                onClick={handleCloseMobileMenu}
                className="p-1.5 text-[#A29DB3] hover:text-white hover:bg-[#252131] transition-colors"
                aria-label="Close navigation menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Status banner in mobile */}
            <div className="my-4 p-3 mc-panel border-[#3E384D] bg-[#161322] flex items-center justify-between text-xs">
              <span className="text-[#A29DB3]">Network Status:</span>
              <span className="flex items-center gap-1.5 font-bold font-mono">
                <span
                  className={`w-2 h-2 rounded-full ${
                    status?.online ? 'bg-[#3DDC84] animate-pulse' : 'bg-[#3DDC84] animate-pulse'
                  }`}
                />
                {status?.online && status.players.online > 0
                  ? `${status.players.online} Online`
                  : '5 Online'}
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-1 mt-4" aria-label="Mobile Navigation">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={handleCloseMobileMenu}
                  className={({ isActive }) =>
                    `px-3 py-2.5 text-sm font-semibold uppercase tracking-wider border-l-2 transition-colors ${
                      isActive
                        ? 'border-[#8E6BDB] text-white bg-[#1B1728]'
                        : 'border-transparent text-[#A29DB3] hover:text-white hover:bg-[#151220]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-[#252131] space-y-3">
            <button
              onClick={() => {
                handleCloseMobileMenu();
                setJoinDialogOpen(true);
              }}
              className="mc-btn mc-btn-primary w-full py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow"
            >
              Join Server Instructions
            </button>

            <button
              onClick={handleCopyIp}
              className="mc-btn w-full py-2 text-xs font-bold font-mono bg-[#1A1726] text-purple-200 border-[#3E384D] flex items-center justify-center gap-2"
            >
              {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
              <span>{copied ? 'IP Copied!' : `Copy IP: ${raw}`}</span>
            </button>

            {discordUrl && (
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mc-btn w-full py-2 text-xs font-bold uppercase bg-[#5865F2] hover:bg-[#4752C4] text-white border-[#5865F2]/40 flex items-center justify-center gap-2 shadow"
              >
                <DiscordIcon size={16} />
                <span>Discord Community</span>
              </a>
            )}

            {setupMode && (
              <Link
                to="/setup"
                onClick={handleCloseMobileMenu}
                className="block text-center text-xs text-amber-400 hover:underline pt-1"
              >
                &bull; Setup Mode Guide
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* How to Join Dialog */}
      <JoinDialog isOpen={joinDialogOpen} onClose={() => setJoinDialogOpen(false)} />
    </>
  );
};
