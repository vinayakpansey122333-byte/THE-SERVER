import { RuleCategory } from '../types';

export const rulesLastUpdated = '2026-10-09';
export const rulesSource: 'sample' | 'configured' = 'configured';

export const ruleCategories: RuleCategory[] = [
  {
    id: 'cheating',
    title: '1. Cheating, Hacked Clients & Unfair Advantages',
    description: 'Any modification, tool, or macro that alters standard player gameplay mechanics is strictly disallowed.',
    rules: [
      {
        id: 'rule-1-1',
        number: '1.1',
        title: 'Hacked Clients & Illegal Mod Usage',
        description:
          'Using clients or mods providing unfair advantages (including but not limited to Killaura, Fly, Speed, X-Ray, Auto-Totem, Baritone, FastBreak, Freecam) is forbidden.',
        examples: [
          'Using X-Ray texture packs or mods to locate ancient debris or diamonds',
          'Automated combat assistance or aim assist',
        ],
        punishment: 'Immediate 30-day ban on 1st offense; permanent hardware/IP ban on 2nd offense.',
      },
      {
        id: 'rule-1-2',
        number: '1.2',
        title: 'Hardware Macros & Auto-Clickers',
        description:
          'Automating actions while away from your keyboard (AFK clickers, weighted keys, hardware macros) to mine, attack, or bypass AFK kickers is prohibited.',
        examples: [
          'Using an auto-clicker left on overnight at an auto-mob spawner',
          'Scripted macros for instant weapon switching',
        ],
        punishment: 'Inventory wipe and 7-day temporary ban.',
      },
    ],
  },
  {
    id: 'exploits',
    title: '2. Exploits, Glitches & Duplication',
    description: 'Benefiting from server bugs or Minecraft physics flaws to clone resources undermines the economy for everyone.',
    rules: [
      {
        id: 'rule-2-1',
        number: '2.1',
        title: 'Item Duplication (Duping)',
        description:
          'Utilizing server lag, piston glitches, chunk overloading, or vehicle de-sync bugs to clone items, blocks, or currency is strictly illegal.',
        examples: [
          'Shulker box duplication using portal desync',
          'Piston string/carpet duper farms outside of staff-approved mechanics',
        ],
        punishment: 'Permanent ban and complete player data rollback.',
      },
      {
        id: 'rule-2-2',
        number: '2.2',
        title: 'Exploit Reporting Obligation',
        description:
          'Players who discover an unintended exploit, command flaw, or economy loop must report it privately to staff via a Discord ticket immediately.',
        examples: [
          'Finding an infinite currency shop buy/sell price miscalculation and silently hoarding currency',
        ],
        punishment: 'Players who exploit without reporting face permanent bans; players who report are eligible for bug bounty rewards.',
      },
    ],
  },
  {
    id: 'chat',
    title: '3. Chat Decency, Respect & Harassment',
    description: 'We strive to provide a competitive yet friendly environment for all players.',
    rules: [
      {
        id: 'rule-3-1',
        number: '3.1',
        title: 'Harassment, Hate Speech & Discrimination',
        description:
          'Zero tolerance for racism, sexism, homophobia, religious hatred, doxxing, death wishes, or targeted harassment of any community member.',
        examples: [
          'Posting personal information or social media handles without consent',
          'Using derogatory slurs in public chat, town chat, or on signs/books',
        ],
        punishment: 'Permanent chat mute or permanent network ban depending on severity.',
      },
      {
        id: 'rule-3-2',
        number: '3.2',
        title: 'Excessive Toxicity & Provocation',
        description:
          'Competitive banter after PvP is natural, but repetitive insults, bypass filter attempts, or intentional malice to degrade player experience is forbidden.',
        examples: [
          'Spamming toxic remarks after killing a player in combat',
          'Circumventing chat profanity filters with symbols or spaced letters',
        ],
        punishment: '1 hour mute on 1st offense; escalating to 24 hours and 7 days.',
      },
    ],
  },
  {
    id: 'spam',
    title: '4. Spam & Advertising',
    description: 'Public chat must remain readable and free of external promotions.',
    rules: [
      {
        id: 'rule-4-1',
        number: '4.1',
        title: 'External Server Advertising',
        description:
          'Promoting other Minecraft servers, Discord communities, YouTube/Twitch channels without permission, or commercial services in chat, private messages, or mail is prohibited.',
        examples: [
          'Sending other server IPs or Discord invite links in global chat or /msg',
        ],
        punishment: 'Permanent automated IP ban for advertising bots; 30-day ban for regular players.',
      },
      {
        id: 'rule-4-2',
        number: '4.2',
        title: 'Chat Flooding & Repetitive Spam',
        description:
          'Spamming repetitive messages, excessive capital letters, character repeating, or rapid command messages.',
        examples: [
          'Sending the same trade advertisement 5 times within 30 seconds',
        ],
        punishment: 'Automated 15-minute mute via chat filter.',
      },
    ],
  },
  {
    id: 'trading',
    title: '5. Economy, Trading & Real-Money Transactions (RMT)',
    description: 'Protecting player safety and complying with financial standards.',
    rules: [
      {
        id: 'rule-5-1',
        number: '5.1',
        title: 'Real-Money Trading (RMT)',
        description:
          'Buying or selling in-game currency, items, plots, or services for real-world currency (PayPal, Crypto, Gift Cards, etc.) is strictly prohibited.',
        examples: [
          'Offering $10 USD PayPal in exchange for 1,000,000 in-game currency',
          'Trading Steam game keys for netherite gear',
        ],
        punishment: 'Permanent ban for both buyer and seller; confiscation of all involved assets.',
      },
      {
        id: 'rule-5-2',
        number: '5.2',
        title: 'Scamming in Protected Trading Systems',
        description:
          'Scamming through the official /trade GUI or auction house is impossible by design, but renaming items with deceptive lore or bait-and-switch renaming is banned.',
        examples: [
          'Renaming an iron sword to "Netherite Sword" with anvil formatting to deceive buyers',
        ],
        punishment: 'Item restitution and 14-day ban.',
      },
    ],
  },
  {
    id: 'accounts',
    title: '6. Account Abuse & Staff Impersonation',
    description: 'Fair identity and moderation integrity.',
    rules: [
      {
        id: 'rule-6-1',
        number: '6.1',
        title: 'Ban Evasion & Alternate Accounts',
        description:
          'Using alternative accounts (alts), VPNs, or proxy connections to bypass active bans, mutes, or claim land beyond player limits is forbidden.',
        examples: [
          'Joining on a second account while your primary account is serving a 7-day ban',
        ],
        punishment: 'Immediate permanent ban on all alternate accounts; ban duration doubled on primary account.',
      },
      {
        id: 'rule-6-2',
        number: '6.2',
        title: 'Staff Impersonation',
        description:
          'Claiming to be a staff member, using misleading color prefixes, or claiming to have administrative powers you do not possess.',
        examples: [
          'Telling players in chat that you are an undercover admin or manager',
        ],
        punishment: '14-day ban.',
      },
    ],
  },
];
