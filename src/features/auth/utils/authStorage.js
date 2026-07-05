const AUTH_USERS_KEY = "panda-day-auth-users";
const CURRENT_USER_KEY = "currentUser";
const GUEST_SESSION_KEY = "guestSession";

function readJson(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export function getAuthUsers() {
  return readJson(AUTH_USERS_KEY, []);
}

export function findAuthUser(email) {
  const normalizedEmail = email.trim().toLowerCase();
  return getAuthUsers().find((user) => user.email.toLowerCase() === normalizedEmail) || null;
}

export function createLocalUser({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  if (findAuthUser(normalizedEmail)) {
    throw new Error("A panda account already exists for that email.");
  }

  const user = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
    accountType: "local",
  };

  writeJson(AUTH_USERS_KEY, [...getAuthUsers(), user]);
  return user;
}

export function loginLocalUser(email, password) {
  const user = findAuthUser(email);
  if (!user || user.password !== password) return null;
  return user;
}

export function createUserSession(user) {
  localStorage.removeItem(GUEST_SESSION_KEY);
  return writeJson(CURRENT_USER_KEY, {
    isGuest: false,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      accountType: user.accountType,
    },
    enteredAt: new Date().toISOString(),
  });
}

export function createGuestSession() {
  localStorage.removeItem(CURRENT_USER_KEY);
  return writeJson(GUEST_SESSION_KEY, {
    isGuest: true,
    enteredAt: new Date().toISOString(),
  });
}

export function getAuthSession() {
  return readJson(CURRENT_USER_KEY, null) || readJson(GUEST_SESSION_KEY, null);
}

export function clearAuthSession() {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(GUEST_SESSION_KEY);
}
