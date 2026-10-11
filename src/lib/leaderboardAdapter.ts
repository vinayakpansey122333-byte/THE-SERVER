import { LeaderboardEntry, DataResult } from '../types';
import { siteConfig, isPlaceholder } from '../config/siteConfig';

export type StatCategory = 'playtime' | 'kills' | 'balance' | 'blocks_mined';
export type StatPeriod = 'all-time' | 'monthly';

export interface LeaderboardResponse {
  category: StatCategory;
  period: StatPeriod;
  entries: LeaderboardEntry[];
  totalTracked?: number;
}

/**
 * Expected JSON schema when integrating an HTTPS plugin or server stats REST API:
 * GET {statsApiUrl}?stat={stat}&period={period}
 * Response: {
 *   success: true,
 *   data: [
 *     { "rank": 1, "username": "Steve", "uuid": "...", "value": 1420, "formattedValue": "1,420 Hours" }
 *   ]
 * }
 */
export async function fetchLeaderboards(
  category: StatCategory,
  period: StatPeriod,
  signal?: AbortSignal
): Promise<DataResult<LeaderboardResponse>> {
  if (!siteConfig.statsApiUrl || isPlaceholder(siteConfig.statsApiUrl)) {
    return {
      state: 'UNAVAILABLE',
      data: null,
      error: 'Leaderboard API endpoint [[STATS_API_URL]] is not yet connected to a server statistics plugin or REST backend.',
    };
  }

  try {
    const url = new URL(siteConfig.statsApiUrl);
    url.searchParams.set('stat', category);
    url.searchParams.set('period', period);

    const res = await fetch(url.toString(), {
      signal,
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      return {
        state: 'ERROR',
        data: null,
        error: `Stats API responded with status ${res.status}`,
        fetchedAt: Date.now(),
      };
    }

    const json = await res.json();
    return {
      state: 'LIVE',
      data: {
        category,
        period,
        entries: json.data || [],
        totalTracked: json.totalTracked,
      },
      fetchedAt: Date.now(),
    };
  } catch (err: unknown) {
    return {
      state: 'ERROR',
      data: null,
      error: (err as Error)?.message || 'Failed to fetch statistics from backend endpoint.',
      fetchedAt: Date.now(),
    };
  }
}

/**
 * Verified sample data for development preview only.
 * Always flagged with SAMPLE – edit in config.
 */
export const SAMPLE_LEADERBOARDS: Record<StatCategory, LeaderboardEntry[]> = {
  playtime: [
    { rank: 1, username: 'NetherKnight', value: 842, formattedValue: '842 Hours', badge: 'Veteran' },
    { rank: 2, username: 'DiamondDigger', value: 691, formattedValue: '691 Hours', badge: 'Veteran' },
    { rank: 3, username: 'EnderMaster', value: 520, formattedValue: '520 Hours' },
    { rank: 4, username: 'CraftingQueen', value: 438, formattedValue: '438 Hours' },
    { rank: 5, username: 'BlockBuster_99', value: 312, formattedValue: '312 Hours' },
  ],
  kills: [
    { rank: 1, username: 'BladeRunner', value: 1420, formattedValue: '1,420 Kills', badge: 'Gladiator' },
    { rank: 2, username: 'ShadowStriker', value: 1105, formattedValue: '1,105 Kills' },
    { rank: 3, username: 'BowMaster_MC', value: 890, formattedValue: '890 Kills' },
    { rank: 4, username: 'IronVanguard', value: 642, formattedValue: '642 Kills' },
    { rank: 5, username: 'StealthSniper', value: 512, formattedValue: '512 Kills' },
  ],
  balance: [
    { rank: 1, username: 'GoldBaron', value: 12500000, formattedValue: '$12,500,000', badge: 'Tycoon' },
    { rank: 2, username: 'MarketMaker', value: 8940000, formattedValue: '$8,940,000' },
    { rank: 3, username: 'EmeraldMerchant', value: 6150000, formattedValue: '$6,150,000' },
    { rank: 4, username: 'AuctionWhale', value: 4820000, formattedValue: '$4,820,000' },
    { rank: 5, username: 'TradeKing', value: 3200000, formattedValue: '$3,200,000' },
  ],
  blocks_mined: [
    { rank: 1, username: 'PickaxePro', value: 2450000, formattedValue: '2,450,000 Blocks', badge: 'Excavator' },
    { rank: 2, username: 'DeepslateDan', value: 1890000, formattedValue: '1,890,000 Blocks' },
    { rank: 3, username: 'CaveCrawler', value: 1420000, formattedValue: '1,420,000 Blocks' },
    { rank: 4, username: 'OreObsessed', value: 980000, formattedValue: '980,000 Blocks' },
    { rank: 5, username: 'BedrockBreaker', value: 760000, formattedValue: '760,000 Blocks' },
  ],
};
