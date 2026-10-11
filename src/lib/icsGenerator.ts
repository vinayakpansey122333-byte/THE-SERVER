import { ServerEvent } from '../types';
import { getEffectiveBrandName, getEffectiveServerAddress } from '../config/siteConfig';

/**
 * Formats a Date object into iCalendar UTC datetime format: YYYYMMDDTHHmmssZ
 */
function formatIcsDate(isoString: string): string {
  const d = new Date(isoString);
  return d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

/**
 * Generates an RFC 5545 compliant .ics string and triggers a local file download
 */
export function downloadEventIcs(event: ServerEvent): void {
  const brand = getEffectiveBrandName();
  const { raw } = getEffectiveServerAddress();
  const dtStart = formatIcsDate(event.startDateTime);
  const dtEnd = formatIcsDate(event.endDateTime);
  const now = formatIcsDate(new Date().toISOString());

  const cleanDescription = `${event.description}\n\nPrizes: ${event.rewards.join(', ')}\n\nServer IP: ${raw}`
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The SERVER Minecraft Network//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}-${Date.now()}@minecraft-server`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:[${brand}] ${event.title}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${raw} (Minecraft Server)`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${event.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
