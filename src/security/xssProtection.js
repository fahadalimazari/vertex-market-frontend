/**
 * Sanitizes input strings to prevent basic XSS attacks.
 * In a real backend, this should be done on the server.
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

/**
 * Validates URLs to ensure they are safe.
 */
export const isSafeUrl = (url) => {
  try {
    const parsed = new URL(url, window.location.origin);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (e) {
    return false;
  }
};
