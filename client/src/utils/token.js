/**
 * DevTrack Universal Auth Token Resolver
 * Seamlessly resolves JWT token whether stored directly or inside devtrack_user payload.
 */
export function getToken() {
  const direct = localStorage.getItem('token');
  if (direct) return direct;

  try {
    const raw = localStorage.getItem('devtrack_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.token) {
        // Self-heal: synchronize direct token key
        localStorage.setItem('token', parsed.token);
        return parsed.token;
      }
    }
  } catch {
    // Ignore JSON parse errors
  }

  return null;
}

export function getAuthHeaders() {
  const token = getToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
}
