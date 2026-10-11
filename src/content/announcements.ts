import { ServerAnnouncement } from '../types';

export const serverAnnouncements: ServerAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Server Network Infrastructure Migration Complete',
    date: '2026-10-08',
    category: 'Update',
    summary: 'High-speed Caspian node upgrade with reduced latency and improved tick rates.',
    content: [
      'We have successfully migrated our world saves to our dedicated node on port 40704 with NVMe SSD storage.',
      'Paper server optimizations have increased average MSPT (milliseconds per tick) to a solid 20.0 TPS even during peak active hours.',
      'Connect using the primary address: heaven.caspian.host:40704.',
    ],
    important: true,
    source: 'configured',
  },
  {
    id: 'ann-2',
    title: 'Economy & Auction House Balance Patch',
    date: '2026-10-02',
    category: 'Update',
    summary: 'Adjusted crop sell multipliers and reduced auction tax to promote player-to-player commerce.',
    content: [
      'Farming sell prices rebalanced to reward diverse multi-crop farming rather than single-crop automation.',
      'Global Auction House listing fee reduced from 5% to 2.5% to encourage trade volume.',
      'Added /trade security confirmation timer to prevent fast-swap trade scamming.',
    ],
    source: 'configured',
  },
  {
    id: 'ann-3',
    title: 'Scheduled Autumn Maintenance Window',
    date: '2026-09-28',
    category: 'Maintenance',
    summary: 'Routine database cleanup, region defragmentation, and backup integrity check.',
    content: [
      'Automated maintenance completed with zero downtime for active players.',
      'Backup snapshots verified and synced across off-site storage.',
    ],
    source: 'configured',
  },
];
