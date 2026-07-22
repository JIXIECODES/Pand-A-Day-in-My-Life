const LEGACY_AUTH_USERS_KEY = "panda-day-auth-users";
const LEGACY_CURRENT_USER_KEY = "currentUser";
const GUEST_SESSION_KEY = "guestSession";

function readJson(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function createGuestSession() {
  const guestSession = {
    isGuest: true,
    enteredAt: new Date().toISOString(),
  };
  localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(guestSession));
  return guestSession;
}

export function getGuestSession() {
  return readJson(GUEST_SESSION_KEY, null);
}

export function clearGuestSession() {
  localStorage.removeItem(GUEST_SESSION_KEY);
}

export function removeLegacyLocalCredentials() {
  localStorage.removeItem(LEGACY_AUTH_USERS_KEY);
  localStorage.removeItem(LEGACY_CURRENT_USER_KEY);
}