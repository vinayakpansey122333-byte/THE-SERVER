/**
 * Robust cross-browser clipboard copy with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // Modern navigator.clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      announceClipboard(`Copied "${text}" to clipboard.`);
      return true;
    } catch {
      // Fallback below
    }
  }

  // Legacy textarea fallback
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) {
      announceClipboard(`Copied "${text}" to clipboard.`);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

function announceClipboard(message: string) {
  let announcer = document.getElementById('clipboard-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'clipboard-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
  }
  announcer.textContent = message;
}
