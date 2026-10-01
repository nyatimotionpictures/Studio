/**
 * @name copyToClipboard
 * @description Copy text to the clipboard.
 *
 * navigator.clipboard is unavailable on insecure origins, and this studio is
 * reachable over plain http on a LAN address (see the studio origin allowlist
 * in studio-server/src/utils/corsOptions.js), so a textarea fallback is needed
 * rather than optional.
 *
 * @param {string} text
 * @returns {Promise<boolean>} whether the copy succeeded
 */
export const copyToClipboard = async (text) => {
  if (!text) return false;

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
};

/**
 * @name slugifyTitle
 * @description Mirror of the server-side slugify, used to preview the slug an
 * admin will get. The server remains the source of truth on save.
 * @param {string} value
 * @returns {string}
 */
export const slugifyTitle = (value) =>
  String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
