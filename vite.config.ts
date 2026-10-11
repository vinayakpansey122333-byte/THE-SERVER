import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const inMemoryTickets: Array<{
  id: string;
  name: string;
  minecraftUsername: string;
  topic: string;
  message: string;
  createdAt: string;
  status: string;
}> = [];

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-plugin',
    configureServer(server) {
      // Tickets & Ban Appeals Endpoint
      server.middlewares.use('/api/tickets', async (req, res) => {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ tickets: inMemoryTickets }));
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const ticketData = JSON.parse(body || '{}');
              const newTicket = {
                id: 'TICKET-' + Date.now().toString(36).toUpperCase(),
                name: ticketData.name || 'Anonymous',
                minecraftUsername: ticketData.minecraftUsername || 'Unknown',
                topic: ticketData.topic || 'general',
                message: ticketData.message || '',
                createdAt: new Date().toISOString(),
                status: 'pending',
              };
              inMemoryTickets.unshift(newTicket);

              // If a Discord Webhook URL is set in environment, forward directly to Discord channel
              const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
              if (discordWebhook) {
                try {
                  await fetch(discordWebhook, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      embeds: [
                        {
                          title: `New Ticket: ${newTicket.topic.toUpperCase()}`,
                          color: 0x8e6bdb,
                          fields: [
                            { name: 'Player IGN', value: newTicket.minecraftUsername, inline: true },
                            { name: 'Contact Name', value: newTicket.name, inline: true },
                            { name: 'Ticket ID', value: newTicket.id, inline: true },
                            { name: 'Explanation / Appeal', value: newTicket.message },
                          ],
                          timestamp: newTicket.createdAt,
                        },
                      ],
                    }),
                  });
                } catch (e) {
                  console.error('Discord webhook forward failed:', e);
                }
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, ticket: newTicket }));
            } catch (err: unknown) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid ticket payload' }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end();
      });

      server.middlewares.use('/api/gemini/assistant', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  error:
                    'GEMINI_API_KEY environment variable is not configured. Please verify in the Settings > Secrets panel.',
                })
              );
              return;
            }

            const parsed = JSON.parse(body || '{}');
            const { message, mode, useThinking, useSearch } = parsed;

            if (!message || typeof message !== 'string') {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Message string is required' }));
              return;
            }

            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            // Model selection based on requirements:
            // High thinking: gemini-3.1-pro-preview with thinkingLevel: HIGH
            // Search Grounding: gemini-3.5-flash with googleSearch
            // General fast: gemini-3.5-flash
            let selectedModel = 'gemini-3.5-flash';
            const config: Record<string, unknown> = {
              systemInstruction: `You are the official Server Rule & Command Assistant for "The SERVER" Minecraft multiplayer network.
The server runs standard Minecraft survival with land claiming (/claim), economy & GUI shop (/shop, /ah, /trade), duel arenas (/warp pvp), and events.
Server Host: heaven.caspian.host:40704. Supported versions: 1.20 - 1.21.x.
Strict Rules: No hacked clients/X-Ray, no dupe exploits, no RMT, no harassment, no ban evasion.
Tone: Helpful, objective, concise, and professional. Never make up fictional server lore or fantasy backstories. Keep advice practical for in-game players.`,
            };

            if (useThinking) {
              selectedModel = 'gemini-3.1-pro-preview';
              config.thinkingConfig = {
                thinkingLevel: ThinkingLevel.HIGH,
              };
            } else if (useSearch) {
              selectedModel = 'gemini-3.5-flash';
              config.tools = [{ googleSearch: {} }];
            }

            const response = await ai.models.generateContent({
              model: selectedModel,
              contents: message,
              config,
            });

            const replyText = response.text || 'No response generated.';

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                reply: replyText,
                thinkingUsed: Boolean(useThinking),
                searchGrounded: Boolean(useSearch),
              })
            );
          } catch (err: unknown) {
            console.error('Gemini API Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                error: (err as Error)?.message || 'An error occurred processing the AI request.',
              })
            );
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
