import { openDB, idbPut, idbGet, idbDelete, idbHas } from '../lib/idb.js';

const LS_KEY = 'starfall_v2_save';
const LS_AUTO = 'starfall_v2_autosave';

function lsAvailable() {
  try { window.localStorage.setItem('_test', '1'); window.localStorage.removeItem('_test'); return true; }
  catch (e) { return false; }
}

export class SaveSystem {
  constructor() {
    this._useIDB = false;
    this._storageReady = false;
    this._init();
  }

  async _init() {
    try {
      await openDB();
      this._useIDB = true;
      this._storageReady = true;
    } catch {
      this._useIDB = false;
      this._storageReady = lsAvailable();
    }
  }

  _ls() {
    return this._useIDB ? null : (lsAvailable() ? window.localStorage : null);
  }

  async save(data) {
    const entry = { id: 'main', ...data, timestamp: Date.now() };
    if (this._useIDB && this._storageReady) {
      try { await idbPut('saves', entry); return; } catch {}
    }
    const ls = this._ls();
    if (ls) { ls.setItem(LS_KEY, JSON.stringify(entry)); }
  }

  async load() {
    if (this._useIDB && this._storageReady) {
      try {
        const r = await idbGet('saves', 'main');
        if (r) return r;
      } catch {}
    }
    const ls = this._ls();
    if (ls) {
      const raw = ls.getItem(LS_KEY);
      if (raw) { try { return JSON.parse(raw); } catch {} }
    }
    return null;
  }

  async autoSave(data) {
    const entry = { id: 'autosave', ...data, timestamp: Date.now() };
    if (this._useIDB && this._storageReady) {
      try { await idbPut('saves', entry); return; } catch {}
    }
    const ls = this._ls();
    if (ls) { ls.setItem(LS_AUTO, JSON.stringify(entry)); }
  }

  async loadAutoSave() {
    if (this._useIDB && this._storageReady) {
      try {
        const r = await idbGet('saves', 'autosave');
        if (r) return r;
      } catch {}
    }
    const ls = this._ls();
    if (ls) {
      const raw = ls.getItem(LS_AUTO);
      if (raw) { try { return JSON.parse(raw); } catch {} }
    }
    return null;
  }

  async hasSave() {
    if (this._useIDB && this._storageReady) {
      try { return await idbHas('saves'); } catch {}
    }
    const ls = this._ls();
    if (ls) return ls.getItem(LS_KEY) !== null || ls.getItem(LS_AUTO) !== null;
    return false;
  }

  async deleteSave() {
    if (this._useIDB && this._storageReady) {
      try { await idbDelete('saves', 'main'); await idbDelete('saves', 'autosave'); return; } catch {}
    }
    const ls = this._ls();
    if (ls) { ls.removeItem(LS_KEY); ls.removeItem(LS_AUTO); }
  }

  migrateV1(data) {
    if (!data || data.version >= 2) return data;
    return {
      version: 2,
      timestamp: Date.now(),
      calendar: { chapter: 1, day: 1, period: 0, energy: 3, totalDaysPlayed: 0 },
      flags: data.flags || {},
      relationships: {},
      npcRelations: {},
      memories: [],
      achievements: {},
      inventory: { currency: 0, items: [], equipped: null },
      endings: data.endings || [],
      stats: { dialoguesRead: 0, choicesMade: 0, totalPlayTime: 0, relationshipsFormed: 0 }
    };
  }

  exportSave(data) {
    return JSON.stringify(data, null, 2);
  }

  importSave(json) {
    try {
      const data = JSON.parse(json);
      if (!data.version) return null;
      return data;
    } catch { return null; }
  }
}
