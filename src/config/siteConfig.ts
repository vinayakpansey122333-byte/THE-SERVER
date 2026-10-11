import { SiteConfig, PlaceholderCheck } from '../types';

/**
 * =====================================================================
 * CENTRAL SITE CONFIGURATION & SOURCE OF TRUTH
 * =====================================================================
 * Placeholders are formatted as [[...]] for fast searching and replacement.
 * When placeholders remain unchanged, the site automatically enters "Setup Mode".
 */

export const siteConfig: SiteConfig = {
  // Brand & Identity
  brandName: '[[The SERVER]]',
  tagline: '[[Welcome to the best server ]]',
  logoUrl: '/server_logo.jpg',

  // Network Connectivity
  serverAddress: '[[heaven.caspian.host:40704]]',
  serverPort: 40704, // Parsed from [[40704]]
  bedrockPort: 19132,
  supportedVersions: '[[26.2 & every version ]]',

  // Community & Staff
  discordUrl: 'https://discord.gg/kFXPAu45c',
  managerName: '[[RUSTED_RIDER ]]',

  // Server Status & API Integrations
  statusProvider: '[[STATUS_API_PROVIDER]]' as 'mcstatus.io', // Options: "mcstatus.io" | "mcsrvstat.us" | "custom"
  customStatusUrl: '',
  statsApiUrl: '[[STATS_API_URL]]',

  // Economy & Store
  currencyName: '[[CURRENCY_NAME]]',
  currencySymbol: '[[CURRENCY_SYMBOL]]',
  storeUrl: '[[STORE_URL]]',
  shopMode: 'demo', // Options: "external" | "provider" | "demo"
  contactEmail: 'vinayak.pansey122333@gmail.com',

  // Operations
  maintenanceMode: false,
  maintenanceMessage: 'The server is currently undergoing planned infrastructure optimization.',
  timezone: 'UTC',
};

/**
 * Checks whether a given string is still an unresolved [[PLACEHOLDER]].
 */
export function isPlaceholder(val?: string | null): boolean {
  if (!val) return true;
  return val.trim().startsWith('[[') && val.trim().endsWith(']]');
}

/**
 * Clean display string helper: returns fallback if placeholder
 */
export function getCleanValue(val: string, fallback: string): string {
  return isPlaceholder(val) ? fallback : val;
}

/**
 * Returns list of placeholders and their status for Setup Mode
 */
export function getPlaceholderAudits(): PlaceholderCheck[] {
  return [
    {
      key: 'brandName',
      label: 'Server Brand Name',
      placeholderValue: '[[The SERVER]]',
      currentValue: siteConfig.brandName,
      isConfigured: !isPlaceholder(siteConfig.brandName),
      category: 'core',
      description: 'The public name of your Minecraft network displayed in header, hero, meta tags, and footer.',
      fileLocation: 'src/config/siteConfig.ts',
    },
    {
      key: 'tagline',
      label: 'Network Tagline',
      placeholderValue: '[[Welcome to the best server ]]',
      currentValue: siteConfig.tagline,
      isConfigured: !isPlaceholder(siteConfig.tagline),
      category: 'core',
      description: 'One-line pitch describing your server gameplay focus.',
      fileLocation: 'src/config/siteConfig.ts',
    },
    {
      key: 'serverAddress',
      label: 'Java Server Address & Host',
      placeholderValue: '[[heaven.caspian.host:40704]]',
      currentValue: siteConfig.serverAddress,
      // Note: heaven.caspian.host:40704 is a real Caspian host address if brackets removed or kept
      isConfigured: !siteConfig.serverAddress.includes('[[') && !siteConfig.serverAddress.includes(']]'),
      category: 'network',
      description: 'Host IP or subdomain players enter into their Minecraft multiplayer client.',
      fileLocation: 'src/config/siteConfig.ts',
    },
    {
      key: 'supportedVersions',
      label: 'Supported Minecraft Versions',
      placeholderValue: '[[26.2 & every version ]]',
      currentValue: siteConfig.supportedVersions,
      isConfigured: !isPlaceholder(siteConfig.supportedVersions),
      category: 'network',
      description: 'Minecraft client versions compatible with the network (e.g. 1.20.x - 1.21.x).',
      fileLocation: 'src/config/siteConfig.ts',
    },
    {
      key: 'discordUrl',
      label: 'Discord Community Invite',
      placeholderValue: '[[https://discord.gg/kFXPAu45c]]',
      currentValue: siteConfig.discordUrl,
      isConfigured: !isPlaceholder(siteConfig.discordUrl),
      category: 'integration',
      description: 'Discord server invite URL for community discussion and voice channels.',
      fileLocation: 'src/config/siteConfig.ts',
    },
    {
      key: 'managerName',
      label: 'Staff / Server Manager Name',
      placeholderValue: '[[RUSTED_RIDER ]]',
      currentValue: siteConfig.managerName,
      isConfigured: !isPlaceholder(siteConfig.managerName),
      category: 'core',
      description: 'Designated manager/admin shown in the verified staff directory.',
      fileLocation: 'src/config/siteConfig.ts',
    },
    {
      key: 'statusProvider',
      label: 'Status API Provider',
      placeholderValue: '[[STATUS_API_PROVIDER]]',
      currentValue: siteConfig.statusProvider,
      isConfigured: !isPlaceholder(siteConfig.statusProvider),
      category: 'integration',
      description: 'Public ping provider ("mcstatus.io" or "mcsrvstat.us") to query live player counts and MOTD.',
      fileLocation: 'src/config/siteConfig.ts',
    },
    {
      key: 'currencyName',
      label: 'Economy Currency Name',
      placeholderValue: '[[CURRENCY_NAME]]',
      currentValue: siteConfig.currencyName,
      isConfigured: !isPlaceholder(siteConfig.currencyName),
      category: 'shop',
      description: 'Virtual currency name for player shops and server marketplace.',
      fileLocation: 'src/config/siteConfig.ts',
    },
    {
      key: 'currencySymbol',
      label: 'Currency Symbol',
      placeholderValue: '[[CURRENCY_SYMBOL]]',
      currentValue: siteConfig.currencySymbol,
      isConfigured: !isPlaceholder(siteConfig.currencySymbol),
      category: 'shop',
      description: 'Symbol used before shop prices (e.g. $ or ⛁ or Coins).',
      fileLocation: 'src/config/siteConfig.ts',
    },
    {
      key: 'statsApiUrl',
      label: 'Leaderboard Stats API',
      placeholderValue: '[[STATS_API_URL]]',
      currentValue: siteConfig.statsApiUrl || '',
      isConfigured: !isPlaceholder(siteConfig.statsApiUrl),
      category: 'integration',
      description: 'Optional HTTPS endpoint for real in-game player statistics and leaderboards.',
      fileLocation: 'src/config/siteConfig.ts',
    },
    {
      key: 'storeUrl',
      label: 'External Webstore URL',
      placeholderValue: '[[STORE_URL]]',
      currentValue: siteConfig.storeUrl || '',
      isConfigured: !isPlaceholder(siteConfig.storeUrl),
      category: 'shop',
      description: 'Direct link to external Tebex / CraftingStore webstore if in external shop mode.',
      fileLocation: 'src/config/siteConfig.ts',
    },
  ];
}

/**
 * Returns true if any core or network placeholder remains unconfigured
 */
export function isSetupModeActive(): boolean {
  const audits = getPlaceholderAudits();
  return audits.some((a) => !a.isConfigured);
}

/**
 * Returns the effective server host and port, stripping brackets if present
 */
export function getEffectiveServerAddress(): { host: string; port: number; raw: string } {
  let raw = siteConfig.serverAddress;
  // If wrapped in [[...]], extract inside
  if (raw.startsWith('[[') && raw.endsWith(']]')) {
    raw = raw.slice(2, -2).trim();
  }
  
  // Extract port if formatted as host:port
  if (raw.includes(':')) {
    const [host, portStr] = raw.split(':');
    const port = parseInt(portStr, 10) || siteConfig.serverPort || 25565;
    return { host, port, raw };
  }
  
  return {
    host: raw,
    port: siteConfig.serverPort || 25565,
    raw,
  };
}

/**
 * Returns the clean brand name for display
 */
export function getEffectiveBrandName(): string {
  let name = siteConfig.brandName;
  if (name.startsWith('[[') && name.endsWith(']]')) {
    name = name.slice(2, -2).trim();
  }
  return name || 'The SERVER';
}

/**
 * Returns the clean manager name
 */
export function getEffectiveManagerName(): string {
  let name = siteConfig.managerName;
  if (name.startsWith('[[') && name.endsWith(']]')) {
    name = name.slice(2, -2).trim();
  }
  return name || 'RUSTED_RIDER';
}

/**
 * Returns the clean discord URL
 */
export function getEffectiveDiscordUrl(): string {
  let url = siteConfig.discordUrl;
  if (url.startsWith('[[') && url.endsWith(']]')) {
    url = url.slice(2, -2).trim();
  }
  return url || 'https://discord.gg/kFXPAu45c';
}

/**
 * Returns clean currency symbol
 */
export function getEffectiveCurrency(): { name: string; symbol: string } {
  const name = isPlaceholder(siteConfig.currencyName) ? 'Coins' : siteConfig.currencyName;
  const symbol = isPlaceholder(siteConfig.currencySymbol) ? '$' : siteConfig.currencySymbol;
  return { name, symbol };
}

/**
 * Returns the configured manager/appeal email address
 */
export function getEffectiveContactEmail(): string {
  return siteConfig.contactEmail || 'vinayak.pansey122333@gmail.com';
}
