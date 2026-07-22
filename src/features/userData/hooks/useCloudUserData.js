import { useEffect, useState } from "react";
import {
  getStorageSnapshot,
  hasMeaningfulStorageData,
  replaceStorageSnapshot,
  setStorageOwner,
  STORAGE_CHANGE_EVENT,
} from "../../../shared/utils/storage.js";
import { fetchUserData, saveUserData } from "../services/userDataService.js";

const SYNC_META_PREFIX = "panda-day-sync:";
const bootstrapPromises = new Map();

function syncMetaKey(userId) {
  return `${SYNC_META_PREFIX}${userId}`;
}

function readSyncMeta(userId) {
  try {
    return JSON.parse(localStorage.getItem(syncMetaKey(userId))) || {};
  } catch {
    return {};
  }
}

function writeSyncMeta(userId, updates) {
  const next = { ...readSyncMeta(userId), ...updates };
  localStorage.setItem(syncMetaKey(userId), JSON.stringify(next));
  return next;
}


function fallbackSeed(user, currentSnapshot, meta) {
  const legacyAccountSnapshot = getStorageSnapshot(user.email);
  const guestSnapshot = getStorageSnapshot("guest");

  if (hasMeaningfulStorageData(currentSnapshot)) return { data: currentSnapshot, source: "account-cache" };
  if (hasMeaningfulStorageData(legacyAccountSnapshot)) return { data: legacyAccountSnapshot, source: "legacy-account" };
  if (!meta.migrationCompletedAt && hasMeaningfulStorageData(guestSnapshot)) return { data: guestSnapshot, source: "guest" };
  return { data: {}, source: null };
}

async function bootstrapAccountData(user) {
  const userId = user.id;
  setStorageOwner(userId);
  const currentSnapshot = getStorageSnapshot(userId);
  const meta = readSyncMeta(userId);

  try {
    const cloudRecord = await fetchUserData(userId);

    if (cloudRecord) {
      if (
        meta.dirtyAt
        && hasMeaningfulStorageData(currentSnapshot)
        && meta.lastSyncedAt === cloudRecord.updated_at
      ) {
        const saved = await saveUserData(userId, currentSnapshot, cloudRecord.updated_at);
        writeSyncMeta(userId, { dirtyAt: null, lastSyncedAt: saved.updated_at });
        return { notice: "Your saved offline changes are back in sync.", status: "saved" };
      }

      replaceStorageSnapshot(userId, cloudRecord.data || {});
      writeSyncMeta(userId, { dirtyAt: null, lastSyncedAt: cloudRecord.updated_at });
      return { notice: "", status: "saved" };
    }

    const seed = fallbackSeed(user, currentSnapshot, meta);
    replaceStorageSnapshot(userId, seed.data);
    const saved = await saveUserData(userId, seed.data);
    if (seed.source === "guest") replaceStorageSnapshot("guest", {});
    if (seed.source === "legacy-account" && user.email) replaceStorageSnapshot(user.email, {});
    writeSyncMeta(userId, {
      dirtyAt: null,
      lastSyncedAt: saved.updated_at,
      migrationCompletedAt: seed.source ? new Date().toISOString() : meta.migrationCompletedAt || null,
      migrationSource: seed.source,
    });

    return {
      notice: seed.source === "guest" || seed.source === "legacy-account"
        ? "Your progress from this browser was safely added to your account."
        : "",
      status: "saved",
    };
  } catch {
    const seed = fallbackSeed(user, currentSnapshot, meta);
    if (!hasMeaningfulStorageData(currentSnapshot) && hasMeaningfulStorageData(seed.data)) {
      replaceStorageSnapshot(userId, seed.data);
    }
    if (hasMeaningfulStorageData(seed.data)) {
      writeSyncMeta(userId, { dirtyAt: meta.dirtyAt || new Date().toISOString() });
    }
    return {
      notice: "Unable to sync right now. Your changes are stored locally and will retry.",
      status: "offline",
    };
  }
}

function getBootstrapPromise(user) {
  if (!bootstrapPromises.has(user.id)) {
    const promise = bootstrapAccountData(user).finally(() => bootstrapPromises.delete(user.id));
    bootstrapPromises.set(user.id, promise);
  }
  return bootstrapPromises.get(user.id);
}

export function useCloudUserData(user) {
  const [loadedUserId, setLoadedUserId] = useState(null);
  const [notice, setNotice] = useState("");
  const [status, setStatus] = useState(user ? "loading" : "local");

  useEffect(() => {
    if (!user) {
      setLoadedUserId(null);
      setNotice("");
      setStatus("local");
      return undefined;
    }

    let active = true;
    let saveTimer = null;
    setLoadedUserId(null);
    setNotice("");
    setStatus("loading");
    setStorageOwner(user.id);

    async function flushChanges() {
      if (!active) return;
      try {
        const syncMeta = readSyncMeta(user.id);
        const saved = await saveUserData(user.id, getStorageSnapshot(user.id), syncMeta.lastSyncedAt || null);
        if (!active) return;
        writeSyncMeta(user.id, { dirtyAt: null, lastSyncedAt: saved.updated_at });
        setNotice("");
        setStatus("saved");
      } catch {
        if (!active) return;
        setStatus("offline");
        setNotice("Unable to sync right now. Your changes are stored locally and will retry.");
      }
    }

    function queueSave(delay = 450) {
      writeSyncMeta(user.id, { dirtyAt: new Date().toISOString() });
      setStatus("saving");
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(flushChanges, delay);
    }

    function handleStorageChange(event) {
      if (event.detail?.owner === user.id.toLowerCase()) queueSave();
    }

    async function retryWhenOnline() {
      setLoadedUserId(null);
      setStatus("loading");
      const result = await getBootstrapPromise(user);
      if (!active) return;
      setNotice(result.notice);
      setStatus(result.status);
      setLoadedUserId(user.id);
    }

    getBootstrapPromise(user).then((result) => {
      if (!active) return;
      setNotice(result.notice);
      setStatus(result.status);
      setLoadedUserId(user.id);
      window.addEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);
      window.addEventListener("online", retryWhenOnline);
    });

    return () => {
      active = false;
      window.clearTimeout(saveTimer);
      window.removeEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);
      window.removeEventListener("online", retryWhenOnline);
    };
  }, [user?.id, user?.email]);

  return {
    notice,
    ready: !user || loadedUserId === user.id,
    status,
  };
}