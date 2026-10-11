import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const inMemoryTickets: Array<{
  id: string;
  name: string;
  minecraftUsername: string;
  topic: string;
  message: string;
  createdAt: string;
  status: string;
}> = [];

// Tickets & Ban Appeals Endpoints
app.get('/api/tickets', (req, res) => {
  res.json({ tickets: inMemoryTickets });
});

app.post('/api/tickets', async (req, res) => {
  try {
    const { name, minecraftUsername, topic, message } = req.body;
    const newTicket = {
      id: 'TICKET-' + Date.now().toString(36).toUpperCase(),
      name: name || 'Anonymous',
      minecraftUsername: minecraftUsername || 'Unknown',
      topic: topic || 'general',
      message: message || '',
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    inMemoryTickets.unshift(newTicket);

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

    res.json({ success: true, ticket: newTicket });
  } catch (err: unknown) {
    res.status(400).json({ error: 'Failed to process ticket' });
  }
});

// API route for server-side Gemini Assistant
app.post('/api/gemini/assistant', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({
        error:
          'GEMINI_API_KEY is not configured on the server. Please add your key in the AI Studio Settings > Secrets panel.',
      });
      return;
    }

    const { message, useThinking, useSearch } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Valid message string is required.' });
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

    res.json({
      reply: response.text || 'No response generated.',
      thinkingUsed: Boolean(useThinking),
      searchGrounded: Boolean(useSearch),
    });
  } catch (err: unknown) {
    console.error('Server Gemini Error:', err);
    res.status(500).json({
      error: (err as Error)?.message || 'An error occurred while generating response.',
    });
  }
});

// Serve Vite build assets
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
