import { ServerEvent } from '../types';

export const serverEvents: ServerEvent[] = [
  {
    id: 'event-weekly-build',
    title: 'Autumn Fortress Build Showcase',
    category: 'building',
    startDateTime: '2026-10-18T18:00:00Z',
    endDateTime: '2026-10-25T23:59:59Z',
    description:
      'Construct your finest fortified outpost or medieval keep in the community creative plot world. Judged on creativity, architectural detail, and interior design.',
    rules: [
      'All structures must be built within assigned 64x64 plot boundaries.',
      'No use of schematic mods or auto-build printers.',
      'Solo or duo teams allowed (rewards split equally).',
      'Original designs only; pre-existing survival builds must be recreated in plot.',
    ],
    rewards: [
      '1st Place: [Architect] prefix title, 50,000 In-Game Coins, 3x Cosmetic Keys',
      '2nd Place: [Builder] prefix title, 25,000 In-Game Coins, 2x Cosmetic Keys',
      '3rd Place: 10,000 In-Game Coins, 1x Cosmetic Key',
      'All Participants: Showcase badge in community hall of fame',
    ],
    participationSteps: [
      'Join the server and type /warp buildcontest',
      'Claim an empty contest plot with /plot auto',
      'Build your design before the closing deadline',
      'Submit your plot using /contest submit',
    ],
    status: 'upcoming',
    source: 'sample',
  },
  {
    id: 'event-dragon-raid',
    title: 'Community Ender Dragon World Raid',
    category: 'community',
    startDateTime: '2026-10-24T20:00:00Z',
    endDateTime: '2026-10-24T22:00:00Z',
    description:
      'Assemble with your fellow players at the End Portal to face empowered Ender Dragon variants and open new End gateway islands.',
    rules: [
      'Wilderness keep-inventory is active during the raid encounter.',
      'PvP is strictly disabled in the central End dimension during the raid.',
      'Bring your own food, armor, and bow supplies.',
    ],
    rewards: [
      'Dragon Egg awarded to top damage contributor',
      'Elytra and Shulker shell drops divided by lottery among all active fighters',
      '5,000 In-Game Coins event completion bonus',
    ],
    participationSteps: [
      'Type /warp endportal 15 minutes before raid start',
      'Ensure your inventory is prepped with projectile weapons',
      'Join the community Discord voice channel for live callouts',
    ],
    status: 'upcoming',
    source: 'sample',
  },
  {
    id: 'event-gladiator-pvp',
    title: '1v1 Iron Gladiator Dueling Tournament',
    category: 'pvp',
    startDateTime: '2026-10-15T19:00:00Z',
    endDateTime: '2026-10-15T21:30:00Z',
    description:
      'Single-elimination combat tournament held in the Colosseum arena with standardized iron kits provided to all contestants.',
    rules: [
      'Standardized server kit: Full Iron Armor, Iron Sword, Bow + 32 Arrows, 3 Golden Apples.',
      'No outside potions, totems, or enchanted gear permitted.',
      'Best 2 out of 3 rounds per match.',
      'Matches monitored and officiated by server staff.',
    ],
    rewards: [
      '1st Place: [Gladiator] prefix, 35,000 In-Game Coins, Diamond trophy banner',
      '2nd Place: 15,000 In-Game Coins',
      '3rd Place: 7,500 In-Game Coins',
    ],
    participationSteps: [
      'Register your username on Discord in #tournament-signups',
      'Arrive in-game at /warp colosseum 10 minutes prior to brackets starting',
      'Accept your duel invitation when called by staff',
    ],
    status: 'upcoming',
    source: 'sample',
  },
  {
    id: 'event-past-nether-launch',
    title: 'Nether World Reset & Bastion Race',
    category: 'tournament',
    startDateTime: '2026-09-20T17:00:00Z',
    endDateTime: '2026-09-20T21:00:00Z',
    description:
      'Fresh 1.21 Nether dimension expansion with first-to-conquer challenges for Ancient Debris and Piglin bastions.',
    rules: [
      'Spawned in fresh Nether terrain with clean seed.',
      'First player to discover and claim Bastion remnants awarded bonus crates.',
    ],
    rewards: [
      'Nether Explorer cosmetic title and netherite upgrade templates',
    ],
    participationSteps: [
      'Completed on September 20, 2026.',
    ],
    status: 'completed',
    source: 'sample',
  },
];
