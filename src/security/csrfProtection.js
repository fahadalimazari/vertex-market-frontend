/**
 * A mock CSRF token generator for API requests.
 */
export const generateCsrfToken = () => {
  return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
};

export const attachCsrfToken = (headers = {}) => {
  const token = sessionStorage.getItem('csrf_token') || generateCsrfToken();
  sessionStorage.setItem('csrf_token', token);
  return { ...headers, 'X-CSRF-Token': token };
};
