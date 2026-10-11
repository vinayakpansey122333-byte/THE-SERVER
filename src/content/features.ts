import { GameplayFeature } from '../types';

export const gameplayFeatures: GameplayFeature[] = [
  {
    id: 'survival-core',
    title: 'Enhanced Survival Gameplay',
    tagline: 'Pure survival progression with modern quality-of-life systems',
    description:
      'Explore an expansive custom world generation with vanilla-compatible terrain. Gather resources, build bases, and survive the night with friends without pay-to-win mechanics.',
    category: 'Survival',
    icon: 'pickaxe',
    highlights: [
      'Grief-protected claim system (/claim)',
      'Custom world generation with biomes',
      'Quality of life commands (/sethome, /tpa, /back)',
      'Vanilla mob balancing and resource drops',
    ],
    commandPreview: '/claim /sethome /tpa',
    source: 'configured',
  },
  {
    id: 'economy-trading',
    title: 'Player-Driven Economy & GUI Shop',
    tagline: 'Trade items, manage player shops, and build your wealth',
    description:
      'Participate in an active server marketplace. Buy and sell resources through server GUI shops, establish private chest shops at player warps, and securely trade items via direct trade interfaces.',
    category: 'Economy',
    icon: 'coin',
    highlights: [
      'In-game GUI shop interface (/shop)',
      'Secure player-to-player trade system (/trade)',
      'Global auction house for rare goods (/ah)',
      'Player chest shops with customizable signs',
    ],
    commandPreview: '/shop /trade /ah',
    source: 'configured',
  },
  {
    id: 'pvp-combat',
    title: 'PvP Arenas & Safezones',
    tagline: 'Optional combat arenas with fair equipment balancing',
    description:
      'Engage in thrilling PvP battles in designated warzones and competitive dueling arenas. Keep-inventory and claims protect your builds in the main survival world, while arenas test your combat skills.',
    category: 'Combat',
    icon: 'sword',
    highlights: [
      'Designated Wilderness PvP zones and outposts',
      'Ranked 1v1 dueling arenas with equal gear kits',
      'Safezone spawn protection',
      'Anti-combat-log mechanism during encounters',
    ],
    commandPreview: '/pvp /duel /warp pvp',
    source: 'configured',
  },
  {
    id: 'events-tournaments',
    title: 'Community Events & Tournaments',
    tagline: 'Weekly competitions with virtual rewards and titles',
    description:
      'Join scheduled community build competitions, parkour trials, Ender Dragon group raids, and seasonal scavenger hunts managed by active staff.',
    category: 'Community',
    icon: 'trophy',
    highlights: [
      'Bi-weekly community build challenges',
      'Weekly automated parkour and maze races',
      'Co-op world boss fights',
      'Virtual trophy rewards and prefix titles',
    ],
    commandPreview: '/events /warp event',
    source: 'configured',
  },
  {
    id: 'ranks-perks',
    title: 'Playtime Ranks & Earnable Cosmetics',
    tagline: '100% Free gameplay rank progression & earnable cosmetics',
    description:
      'Earn in-game playtime ranks and unlock decorative visual perks, particle trails, chat badges, and bonus claim blocks exclusively through active survival gameplay and achievements. Zero real-money payments or pay-to-win mechanics.',
    category: 'Ranks',
    icon: 'shield',
    highlights: [
      '100% Free playtime rank progression (/rankup)',
      'Earnable cosmetic chat formatting & badge colors',
      'Unlockable particle effect auras & block trails',
      'Strictly non-pay-to-win, balanced fair-play economy',
    ],
    commandPreview: '/rankup /perks',
    source: 'configured',
  },
  {
    id: 'community-chat',
    title: 'Active Discord & Cross-Chat',
    tagline: 'Seamless communication between Minecraft and Discord',
    description:
      'Chat with server members even when you are away from your PC. In-game public chat is bridged live with our Discord server for constant community interaction.',
    category: 'Community',
    icon: 'users',
    highlights: [
      'Bidirectional Discord-to-Minecraft chat bridge',
      'Dedicated voice channels for factions and groups',
      'Real-time update notices and changelogs',
      'Direct ticket system for player assistance',
    ],
    commandPreview: '/discord',
    source: 'configured',
  },
];
