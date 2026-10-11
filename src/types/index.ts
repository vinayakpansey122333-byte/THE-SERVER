export type DataSourceState =
  | 'LIVE'
  | 'CONFIGURED'
  | 'SAMPLE'
  | 'STALE'
  | 'LOADING'
  | 'UNAVAILABLE'
  | 'ERROR';

export interface DataResult<T> {
  state: DataSourceState;
  data: T | null;
  fetchedAt?: number;
  error?: string;
}

export interface SiteConfig {
  brandName: string;
  tagline: string;
  serverAddress: string;
  serverPort: number;
  bedrockPort?: number;
  supportedVersions: string;
  discordUrl: string;
  managerName: string;
  logoUrl?: string;
  statusProvider: 'mcstatus.io' | 'mcsrvstat.us' | 'custom';
  customStatusUrl?: string;
  statsApiUrl?: string;
  currencyName: string;
  currencySymbol: string;
  storeUrl?: string;
  shopMode: 'external' | 'provider' | 'demo';
  contactEmail?: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  timezone: string;
}

export interface PlaceholderCheck {
  key: string;
  label: string;
  placeholderValue: string;
  currentValue: string;
  isConfigured: boolean;
  category: 'core' | 'network' | 'integration' | 'shop';
  description: string;
  fileLocation: string;
}

export interface ServerStatusData {
  online: boolean;
  players: {
    online: number;
    max: number;
    list?: Array<{ name: string; uuid: string }>;
  };
  version: {
    name: string;
    protocol?: number;
  };
  motd: {
    raw?: string;
    clean: string;
    html?: string;
  };
  ping?: number;
  icon?: string;
  hostname?: string;
  port?: number;
}

export interface GameplayFeature {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'Survival' | 'Economy' | 'Combat' | 'Community' | 'Ranks';
  icon: string;
  highlights: string[];
  commandPreview?: string;
  source: 'configured' | 'sample';
}

export interface ShopCategory {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'ranks' | 'cosmetics' | 'perks' | 'crates' | 'other';
  price: number;
  currencySymbol: string;
  description: string;
  badge?: string;
  popular?: boolean;
  availability: 'available' | 'limited' | 'sold_out' | 'coming_soon';
  perks: string[];
  deliveryInfo: string;
  source: 'configured' | 'sample';
}

export interface ServerEvent {
  id: string;
  title: string;
  category: 'tournament' | 'building' | 'pvp' | 'community' | 'seasonal';
  startDateTime: string; // ISO string
  endDateTime: string;   // ISO string
  description: string;
  rules: string[];
  rewards: string[];
  participationSteps: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  source: 'configured' | 'sample';
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  uuid?: string;
  value: number;
  formattedValue: string;
  badge?: string;
}

export interface RuleItem {
  id: string;
  number: string;
  title: string;
  description: string;
  examples?: string[];
  punishment: string;
}

export interface RuleCategory {
  id: string;
  title: string;
  description: string;
  rules: RuleItem[];
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: 'Leadership' | 'Moderation' | 'Development' | 'Community';
  avatarUrl?: string;
  about: string;
  contactDiscord?: string;
  joinedDate?: string;
  source: 'configured' | 'sample';
}

export interface ServerAnnouncement {
  id: string;
  title: string;
  date: string;
  category: 'Update' | 'Maintenance' | 'Event' | 'Announcement';
  summary: string;
  content: string[];
  important?: boolean;
  source: 'configured' | 'sample';
}

export interface ContactFormData {
  name: string;
  minecraftUsername: string;
  topic: 'ban_appeal' | 'bug_report' | 'player_report' | 'store_inquiry' | 'general';
  message: string;
  websiteHoneypot?: string;
}
