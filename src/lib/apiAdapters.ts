import { ServerStatusData, DataResult } from '../types';
import { getEffectiveServerAddress, siteConfig, isPlaceholder } from '../config/siteConfig';

/**
 * Strips Minecraft color codes (§0 - §f, §k - §r) and trims safely
 */
export function sanitizeMotd(motd: string): string {
  if (!motd) return '';
  return motd
    .replace(/§[0-9a-fk-or]/gi, '')
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
    .trim();
}

/**
 * Fetches real server status using configured provider
 */
export async function fetchServerStatus(
  signal?: AbortSignal
): Promise<DataResult<ServerStatusData>> {
  const { host, port, raw } = getEffectiveServerAddress();

  // If host is unconfigured or a placeholder
  if (!host || isPlaceholder(raw)) {
    return {
      state: 'UNAVAILABLE',
      data: null,
      error: 'Minecraft server address is not yet configured in siteConfig.ts',
    };
  }

  const startTime = performance.now();
  const provider = isPlaceholder(siteConfig.statusProvider) ? 'mcstatus.io' : siteConfig.statusProvider;

  try {
    let url = '';
    const target = port === 25565 ? host : `${host}:${port}`;

    if (provider === 'mcstatus.io') {
      url = `https://api.mcstatus.io/v2/status/java/${encodeURIComponent(target)}`;
    } else if (provider === 'mcsrvstat.us') {
      url = `https://api.mcsrvstat.us/3/${encodeURIComponent(target)}`;
    } else if (provider === 'custom' && siteConfig.customStatusUrl) {
      url = siteConfig.customStatusUrl.replace('{host}', host).replace('{port}', String(port));
    } else {
      url = `https://api.mcstatus.io/v2/status/java/${encodeURIComponent(target)}`;
    }

    const response = await fetch(url, {
      signal,
      headers: {
        Accept: 'application/json',
      },
    });

    const endTime = performance.now();
    const calculatedPing = Math.round(endTime - startTime);

    if (!response.ok) {
      return {
        state: 'ERROR',
        data: null,
        error: `Status provider returned HTTP ${response.status}`,
        fetchedAt: Date.now(),
      };
    }

    const json = await response.json();

    // Adapter for mcstatus.io
    if (provider === 'mcstatus.io' || url.includes('mcstatus.io')) {
      const isOnline = Boolean(json.online);
      const cleanMotd = json.motd?.clean ? sanitizeMotd(json.motd.clean) : isOnline ? 'Welcome to our Minecraft network!' : 'Server is currently offline.';

      const statusData: ServerStatusData = {
        online: isOnline,
        players: {
          online: json.players?.online ?? 0,
          max: json.players?.max ?? 0,
          list: Array.isArray(json.players?.list)
            ? json.players.list.map((p: { name_clean?: string; name_raw?: string; uuid?: string }) => ({
                name: p.name_clean || p.name_raw || 'Player',
                uuid: p.uuid || '',
              }))
            : [],
        },
        version: {
          name: json.version?.name_clean || json.version?.name_raw || siteConfig.supportedVersions,
          protocol: json.version?.protocol,
        },
        motd: {
          raw: json.motd?.raw,
          clean: cleanMotd,
          html: json.motd?.html,
        },
        ping: json.round_trip_latency ?? calculatedPing,
        icon: json.icon,
        hostname: host,
        port: port,
      };

      return {
        state: isOnline ? 'LIVE' : 'LIVE',
        data: statusData,
        fetchedAt: Date.now(),
      };
    }

    // Adapter for mcsrvstat.us
    if (provider === 'mcsrvstat.us' || url.includes('mcsrvstat.us')) {
      const isOnline = Boolean(json.online);
      const motdClean = Array.isArray(json.motd?.clean)
        ? json.motd.clean.join(' ')
        : json.motd?.clean || (isOnline ? 'Welcome to our Minecraft network!' : 'Server is offline.');

      const statusData: ServerStatusData = {
        online: isOnline,
        players: {
          online: json.players?.online ?? 0,
          max: json.players?.max ?? 0,
          list: Array.isArray(json.players?.list)
            ? json.players.list.map((p: { name: string; uuid?: string }) => ({
                name: p.name,
                uuid: p.uuid || '',
              }))
            : [],
        },
        version: {
          name: json.version || siteConfig.supportedVersions,
          protocol: json.protocol,
        },
        motd: {
          clean: sanitizeMotd(motdClean),
        },
        ping: calculatedPing,
        icon: json.icon,
        hostname: host,
        port: port,
      };

      return {
        state: 'LIVE',
        data: statusData,
        fetchedAt: Date.now(),
      };
    }

    // Custom or fallback
    return {
      state: 'LIVE',
      data: {
        online: Boolean(json.online),
        players: {
          online: json.players?.online ?? 0,
          max: json.players?.max ?? 0,
        },
        version: { name: json.version || 'Paper' },
        motd: { clean: json.motd || 'Online' },
        ping: calculatedPing,
        hostname: host,
        port: port,
      },
      fetchedAt: Date.now(),
    };
  } catch (err: unknown) {
    if ((err as Error)?.name === 'AbortError') {
      return {
        state: 'ERROR',
        data: null,
        error: 'Status request timed out.',
        fetchedAt: Date.now(),
      };
    }
    return {
      state: 'ERROR',
      data: null,
      error: (err as Error)?.message || 'Failed to connect to status provider API',
      fetchedAt: Date.now(),
    };
  }
}
