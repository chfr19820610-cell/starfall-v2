export class StateManager {
  constructor(saveSystem, eventBus) {
    this.saveSystem = saveSystem;
    this.eb = eventBus;
    this.flags = {};
    this.memories = [];
    this.achievements = {};
    this.endings = [];
    this.stats = { dialoguesRead: 0, choicesMade: 0, totalPlayTime: 0, relationshipsFormed: 0 };
    this._loaded = false;
  }

  getState() {
    return {
      version: 2,
      flags: { ...this.flags },
      memories: [...this.memories],
      achievements: { ...this.achievements },
      endings: [...this.endings],
      stats: { ...this.stats }
    };
  }

  loadState(data) {
    if (!data) return;
    if (data.flags) this.flags = { ...data.flags };
    if (data.memories) this.memories = [...data.memories];
    if (data.achievements) this.achievements = { ...data.achievements };
    if (data.endings) this.endings = [...data.endings];
    if (data.stats) this.stats = { ...data.stats };
    this._loaded = true;
  }

  setFlag(key, val = true) {
    this.flags[key] = val;
  }

  getFlag(key) {
    return !!this.flags[key];
  }

  addMemory(mem) {
    const exists = this.memories.find(m => m.id === mem.id);
    if (!exists) {
      this.memories.push({ ...mem, unlocked: true, time: Date.now() });
      this.eb.emit('mem:add', mem);
    }
  }

  unlockAchievement(id) {
    if (this.achievements[id]?.unlocked) return false;
    this.achievements[id] = { unlocked: true, time: Date.now() };
    this.eb.emit('ach:unlock', id);
    return true;
  }

  addEnding(id) {
    if (!this.endings.includes(id)) {
      this.endings.push(id);
      this.eb.emit('end:unlock', id);
    }
  }

  recordDialogue() { this.stats.dialoguesRead++; }
  recordChoice() { this.stats.choicesMade++; }
  recordPlayTime(sec) { this.stats.totalPlayTime += sec; }
  recordRelation() { this.stats.relationshipsFormed++; }

  async save() {
    const state = this.getState();
    await this.saveSystem.autoSave(state);
  }

  async load() {
    const data = await this.saveSystem.loadAutoSave();
    if (data) this.loadState(data);
    return data;
  }

  reset() {
    this.flags = {};
    this.memories = [];
    this.achievements = {};
    this.endings = [];
    this.stats = { dialoguesRead: 0, choicesMade: 0, totalPlayTime: 0, relationshipsFormed: 0 };
  }
}
