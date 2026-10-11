export interface GeminiAssistantRequest {
  message: string;
  mode?: 'general' | 'appeal_analysis' | 'command_guide';
  useThinking?: boolean;
  useSearch?: boolean;
}

export interface GeminiAssistantResponse {
  reply: string;
  thinkingUsed?: boolean;
  searchGrounded?: boolean;
  sources?: Array<{ title?: string; url?: string }>;
}

export async function askGeminiAssistant(
  payload: GeminiAssistantRequest,
  signal?: AbortSignal
): Promise<GeminiAssistantResponse> {
  const res = await fetch('/api/gemini/assistant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${res.status}`);
  }

  return res.json();
}
