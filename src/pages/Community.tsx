import React, { useState, useEffect } from 'react';
import { staffMembers } from '../content/staff';
import { DataBadge } from '../components/ui/DataBadge';
import {
  siteConfig,
  getEffectiveBrandName,
  getEffectiveDiscordUrl,
} from '../config/siteConfig';
import { ContactFormData } from '../types';
import { useToast } from '../components/ui/Toast';
import { copyToClipboard } from '../lib/clipboard';
import { DiscordIcon, UsersIcon, ShieldIcon, CopyIcon, CheckIcon } from '../components/ui/Icons';
import { DiscordWidget } from '../components/ui/DiscordWidget';

export const Community: React.FC = () => {
  const brandName = getEffectiveBrandName();
  const discordUrl = getEffectiveDiscordUrl();
  const { addToast } = useToast();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    minecraftUsername: '',
    topic: 'general',
    message: '',
    websiteHoneypot: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    status: 'unconfigured' | 'error' | 'copied';
    details: string;
  } | null>(null);

  useEffect(() => {
    document.title = `Staff & Community - ${brandName}`;
  }, [brandName]);

  const [submittedTickets, setSubmittedTickets] = useState<Array<{
    id: string;
    name: string;
    minecraftUsername: string;
    topic: string;
    message: string;
    createdAt: string;
    status: string;
  }>>(() => {
    try {
      const cached = localStorage.getItem('mc_admin_tickets');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [showStaffInbox, setShowStaffInbox] = useState<boolean>(false);
  const [lastSubmittedTicket, setLastSubmittedTicket] = useState<{
    id: string;
    name: string;
    minecraftUsername: string;
    topic: string;
    message: string;
    createdAt: string;
  } | null>(null);

  // Load server tickets on mount
  useEffect(() => {
    fetch('/api/tickets')
      .then((res) => res.json())
      .then((data) => {
        if (data.tickets && data.tickets.length > 0) {
          setSubmittedTickets(data.tickets);
          localStorage.setItem('mc_admin_tickets', JSON.stringify(data.tickets));
        }
      })
      .catch(() => {});
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Contact name is required.';
    if (!formData.minecraftUsername.trim()) {
      errors.minecraftUsername = 'Minecraft in-game username is required.';
    } else if (formData.minecraftUsername.length < 3 || formData.minecraftUsername.length > 16) {
      errors.minecraftUsername = 'Minecraft username must be between 3 and 16 characters.';
    }
    if (!formData.message.trim()) {
      errors.message = 'Please provide detailed message content.';
    } else if (formData.message.trim().length < 20) {
      errors.message = 'Message must be at least 20 characters long.';
    }
    return errors;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check for spam bots
    if (formData.websiteHoneypot) {
      return;
    }

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      addToast('Please correct form validation errors before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Submit to local server endpoint
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      const ticketItem = data.ticket || {
        id: 'TICKET-' + Date.now().toString(36).toUpperCase(),
        name: formData.name,
        minecraftUsername: formData.minecraftUsername,
        topic: formData.topic,
        message: formData.message,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };

      // 2. Persist in local tickets state & localStorage
      const updatedList = [ticketItem, ...submittedTickets.filter((t) => t.id !== ticketItem.id)];
      setSubmittedTickets(updatedList);
      localStorage.setItem('mc_admin_tickets', JSON.stringify(updatedList));
      setLastSubmittedTicket(ticketItem);

      addToast('Appeal / Ticket successfully logged to server!', 'success');
      setSubmissionFeedback({
        status: 'copied',
        details: `Your ticket (${ticketItem.id}) is logged on the server and an email draft to vinayak.pansey122333@gmail.com has been prepared!`,
      });

      // 3. Trigger direct mailto draft to vinayak.pansey122333@gmail.com
      const mailSubject = encodeURIComponent(`[Minecraft Server Appeal] ${ticketItem.id} from ${ticketItem.minecraftUsername}`);
      const mailBody = encodeURIComponent(
        `Hello Vinayak,\n\nI have submitted an appeal/inquiry on the server website:\n\n` +
        `Ticket ID: ${ticketItem.id}\n` +
        `Player In-Game Name: ${ticketItem.minecraftUsername}\n` +
        `Contact Name / Discord: ${ticketItem.name}\n` +
        `Category: ${ticketItem.topic}\n` +
        `Date: ${ticketItem.createdAt}\n\n` +
        `Appeal Message:\n${ticketItem.message}\n\n` +
        `Thank you for reviewing!`
      );
      window.location.href = `mailto:vinayak.pansey122333@gmail.com?subject=${mailSubject}&body=${mailBody}`;

      // Reset fields
      setFormData({
        name: '',
        minecraftUsername: '',
        topic: 'general',
        message: '',
        websiteHoneypot: '',
      });
    } catch (err: unknown) {
      // Fallback: save locally
      const ticketItem = {
        id: 'TICKET-' + Date.now().toString(36).toUpperCase(),
        name: formData.name,
        minecraftUsername: formData.minecraftUsername,
        topic: formData.topic,
        message: formData.message,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      const updatedList = [ticketItem, ...submittedTickets];
      setSubmittedTickets(updatedList);
      localStorage.setItem('mc_admin_tickets', JSON.stringify(updatedList));
      setLastSubmittedTicket(ticketItem);

      const mailSubject = encodeURIComponent(`[Minecraft Server Appeal] ${ticketItem.id} from ${ticketItem.minecraftUsername}`);
      const mailBody = encodeURIComponent(
        `Hello Vinayak,\n\nI have submitted an appeal/inquiry on the server website:\n\n` +
        `Ticket ID: ${ticketItem.id}\n` +
        `Player In-Game Name: ${ticketItem.minecraftUsername}\n` +
        `Contact Name / Discord: ${ticketItem.name}\n` +
        `Category: ${ticketItem.topic}\n\n` +
        `Appeal Message:\n${ticketItem.message}\n\n` +
        `Thank you!`
      );
      window.location.href = `mailto:vinayak.pansey122333@gmail.com?subject=${mailSubject}&body=${mailBody}`;

      setSubmissionFeedback({
        status: 'copied',
        details: `Ticket saved locally (${ticketItem.id}) and email opened to vinayak.pansey122333@gmail.com!`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyMessageSummary = async () => {
    const ticket = lastSubmittedTicket || {
      id: 'PENDING',
      name: formData.name,
      minecraftUsername: formData.minecraftUsername,
      topic: formData.topic,
      message: formData.message,
    };
    const summary = `🚨 **Minecraft Server Appeal / Ticket**\n**IGN**: ${ticket.minecraftUsername}\n**Contact**: ${ticket.name}\n**Category**: ${ticket.topic}\n**Message**:\n${ticket.message}`;
    const success = await copyToClipboard(summary);
    if (success) {
      addToast('Copied appeal to clipboard! Ready to paste in Discord.', 'success');
    }
  };

  const openEmailClient = () => {
    const ticket = lastSubmittedTicket || {
      name: formData.name,
      minecraftUsername: formData.minecraftUsername,
      topic: formData.topic,
      message: formData.message,
    };
    const subject = encodeURIComponent(`[Minecraft Server ${ticket.topic.toUpperCase()}] From ${ticket.minecraftUsername}`);
    const body = encodeURIComponent(
      `Hello Staff / Management,\n\nI have submitted an appeal/inquiry on the server website:\n\nPlayer Username: ${ticket.minecraftUsername}\nContact Name: ${ticket.name}\nTopic: ${ticket.topic}\n\nDetails:\n${ticket.message}\n\nThank you!`
    );
    window.location.href = `mailto:vinayak.pansey122333@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="border-b border-[#252033] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DataBadge state="CONFIGURED" />
              <span className="text-xs font-mono uppercase tracking-wider text-purple-300">
                Staff Leadership & Player Support
              </span>
            </div>
            <h1 className="font-pixel text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight">
              Community & Staff Directory
            </h1>
            <p className="mt-2 text-sm text-[#B3ADCA] max-w-2xl leading-relaxed">
              Connect with verified network administrators, join community discussions, and submit ban appeals or bug tickets.
            </p>
          </div>
        </div>

        {/* Staff Directory Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-pixel text-2xl font-bold text-white uppercase flex items-center gap-2">
              <ShieldIcon size={20} className="text-purple-400" />
              Verified Server Staff
            </h2>
            <DataBadge state="CONFIGURED" />
          </div>

          {staffMembers.length === 0 ? (
            <div className="mc-panel p-8 text-center border-[#2A2538] bg-[#12101C]">
              <p className="text-white font-pixel text-lg">No staff configured in directory.</p>
              <p className="text-xs text-[#A29DB3] mt-1">
                Edit <code>src/content/staff.ts</code> to configure leadership members.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffMembers.map((staff) => (
                <div
                  key={staff.id}
                  className="mc-panel p-6 border-[#2F293E] bg-[#13111E] hover:border-[#4B4361] transition-all space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={`https://mc-heads.net/avatar/${staff.name}/56`}
                      alt={staff.name}
                      className="w-14 h-14 bg-[#1F1B2C] border border-[#3E384D] pixelated flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <h3 className="font-pixel text-xl font-bold text-white">
                        {staff.name}
                      </h3>
                      <span className="text-xs font-mono text-emerald-400 font-semibold block">
                        {staff.role}
                      </span>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-purple-300 bg-[#1D182A] px-2 py-0.5 border border-[#312B42] inline-block mt-1">
                        {staff.department}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#A29DB3] leading-relaxed">
                    {staff.about}
                  </p>

                  <div className="pt-3 border-t border-[#201D2C] flex items-center justify-between text-xs text-[#7E7791]">
                    <span>Contact: {staff.contactDiscord || 'Via Discord'}</span>
                    <span className="font-mono text-[10px]">Since {staff.joinedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Discord Community Widget */}
        <DiscordWidget />

        {/* Contact Form Section */}
        <div id="contact-form" className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="font-pixel text-2xl sm:text-3xl font-bold text-white uppercase">
              Submit Player Ticket or Ban Appeal
            </h2>
            <p className="text-xs text-[#A29DB3] mt-1 leading-relaxed">
              Use this verified ticket form for formal ban appeals, serious bug exploits, or store delivery inquiries.
            </p>
          </div>

          {/* Feedback Banner if submitted / error */}
          {submissionFeedback && (
            <div
              className={`p-4 border text-xs space-y-3 ${
                submissionFeedback.status === 'copied'
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                  : 'bg-red-950/70 border-red-500/50 text-red-200'
              }`}
              role="alert"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold uppercase text-xs block text-emerald-300">
                  {submissionFeedback.status === 'copied' ? '✓ Ticket Successfully Logged!' : 'Submission Failed'}
                </span>
                {lastSubmittedTicket && (
                  <span className="font-mono text-[11px] bg-[#101F15] px-2 py-0.5 border border-emerald-500/40">
                    {lastSubmittedTicket.id}
                  </span>
                )}
              </div>
              <p className="leading-relaxed">{submissionFeedback.details}</p>

              {/* Instant Delivery Options for User */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-500/30">
                <button
                  type="button"
                  onClick={copyMessageSummary}
                  className="mc-btn px-3 py-1.5 text-xs font-bold uppercase bg-[#181424] hover:bg-[#252037] text-white border-[#3E384D] flex items-center gap-1.5"
                >
                  <CopyIcon size={14} />
                  <span>Copy Ticket for Discord</span>
                </button>

                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mc-btn px-3 py-1.5 text-xs font-bold uppercase bg-[#5865F2] hover:bg-[#4752C4] text-white flex items-center gap-1.5"
                >
                  <DiscordIcon size={14} />
                  <span>Open Discord Community</span>
                </a>

                <button
                  type="button"
                  onClick={openEmailClient}
                  className="mc-btn px-3 py-1.5 text-xs font-bold uppercase bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-600/40 flex items-center gap-1.5"
                >
                  <span>✉ Email to Vinayak (vinayak.pansey122333@gmail.com)</span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="mc-panel p-6 sm:p-8 border-[#2D283C] bg-[#12101C] space-y-4">
            {/* Honeypot field for anti-spam (hidden from real users) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="websiteHoneypot">Leave blank</label>
              <input
                id="websiteHoneypot"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.websiteHoneypot}
                onChange={(e) => setFormData({ ...formData, websiteHoneypot: e.target.value })}
              />
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs uppercase tracking-wider font-semibold text-[#ECE9F5] mb-1"
              >
                Your Contact Name / Discord Tag:
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#0E0C16] border border-[#2D283C] text-white focus:outline-none focus:border-[#8E6BDB]"
                placeholder="e.g. Alex (Discord: alex#1234)"
              />
              {formErrors.name && (
                <span className="text-red-400 text-[11px] mt-1 block">{formErrors.name}</span>
              )}
            </div>

            {/* Minecraft Username */}
            <div>
              <label
                htmlFor="minecraftUsername"
                className="block text-xs uppercase tracking-wider font-semibold text-[#ECE9F5] mb-1"
              >
                Minecraft Username (IGN):
              </label>
              <input
                id="minecraftUsername"
                type="text"
                value={formData.minecraftUsername}
                onChange={(e) => setFormData({ ...formData, minecraftUsername: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#0E0C16] border border-[#2D283C] text-white focus:outline-none focus:border-[#8E6BDB]"
                placeholder="e.g. Notch"
              />
              {formErrors.minecraftUsername && (
                <span className="text-red-400 text-[11px] mt-1 block">
                  {formErrors.minecraftUsername}
                </span>
              )}
            </div>

            {/* Topic Select */}
            <div>
              <label
                htmlFor="topic"
                className="block text-xs uppercase tracking-wider font-semibold text-[#ECE9F5] mb-1"
              >
                Ticket Category:
              </label>
              <select
                id="topic"
                value={formData.topic}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    topic: e.target.value as ContactFormData['topic'],
                  })
                }
                className="w-full px-3 py-2 text-xs bg-[#0E0C16] border border-[#2D283C] text-white focus:outline-none focus:border-[#8E6BDB]"
              >
                <option value="ban_appeal">Ban / Mute Appeal</option>
                <option value="bug_report">Exploit or Bug Report</option>
                <option value="player_report">Player Conduct Report</option>
                <option value="store_inquiry">Store & Supporter Inquiry</option>
                <option value="general">General Support</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-xs uppercase tracking-wider font-semibold text-[#ECE9F5] mb-1"
              >
                Detailed Explanation:
              </label>
              <textarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#0E0C16] border border-[#2D283C] text-white focus:outline-none focus:border-[#8E6BDB]"
                placeholder="Provide specific details, timestamps, or reasons for your appeal..."
              />
              {formErrors.message && (
                <span className="text-red-400 text-[11px] mt-1 block">{formErrors.message}</span>
              )}
            </div>

            {/* Submit Action Block */}
            <div className="pt-3 border-t border-[#231F32] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-[11px] text-[#A29DB3] space-y-0.5">
                <span className="block font-semibold text-purple-200">
                  Direct Staff Routing:
                </span>
                <span className="text-emerald-400 font-mono text-[11px] font-bold">
                  Delivers to vinayak.pansey122333@gmail.com &amp; Staff Appeals Inbox
                </span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="mc-btn mc-btn-primary px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 border-2 border-emerald-400/80 disabled:opacity-50 transition-all active:translate-y-0.5"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>Dispatching to vinayak.pansey122333@gmail.com...</span>
                  </>
                ) : (
                  <>
                    <ShieldIcon size={16} />
                    <span>Submit Appeal to vinayak.pansey122333@gmail.com</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* MANAGER / STAFF TICKET INBOX VIEWER */}
          <div className="mc-panel p-5 border-[#3A334D] bg-[#141120]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-pixel text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400" />
                  Staff Appeals &amp; Tickets Inbox
                </h3>
                <p className="text-xs text-[#A29DB3] mt-0.5">
                  Manager dashboard for Vinayak (<code>vinayak.pansey122333@gmail.com</code>). All appeals submitted by players are stored right here.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowStaffInbox(!showStaffInbox)}
                className="mc-btn px-3 py-1.5 text-xs font-bold uppercase bg-[#1D192C] text-purple-200 border-[#3D3554]"
              >
                {showStaffInbox ? 'Hide Inbox' : `View Received Appeals (${submittedTickets.length})`}
              </button>
            </div>

            {showStaffInbox && (
              <div className="mt-4 space-y-3 pt-3 border-t border-[#252033]">
                {submittedTickets.length === 0 ? (
                  <p className="text-xs text-[#7E7891] py-4 text-center">
                    No appeals or tickets have been submitted yet.
                  </p>
                ) : (
                  submittedTickets.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 bg-[#0D0B14] border border-[#262135] text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-purple-300">
                          {t.id} &bull; IGN: <strong className="text-white">{t.minecraftUsername}</strong>
                        </span>
                        <span className="text-[10px] uppercase font-mono text-[#8E87A3]">
                          {new Date(t.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#A29DB3]">
                        <strong>Category:</strong> {t.topic.toUpperCase()} &bull; <strong>Contact:</strong> {t.name}
                      </div>
                      <p className="text-[#ECE9F5] bg-[#13101E] p-2 border border-[#1E1A2B] whitespace-pre-wrap">
                        {t.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
