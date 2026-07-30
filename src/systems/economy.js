import { ITEMS, JOBS } from '../data/items.js';

export class EconomySystem {
  constructor(state) {
    this.currency = 0;
    this.items = [];
    this.equipped = null;
    if (state) {
      this.currency = state.currency || 0;
      this.items = state.items ? [...state.items] : [];
      this.equipped = state.equipped || null;
    }
  }

  getState() {
    return {
      currency: this.currency,
      items: [...this.items],
      equipped: this.equipped
    };
  }

  getBalance() { return this.currency; }

  earn(amount) {
    this.currency += Math.abs(amount);
    return this.currency;
  }

  spend(amount) {
    if (this.currency < amount) return false;
    this.currency = Math.max(0, this.currency - amount);
    return true;
  }

  canAfford(amount) { return this.currency >= amount; }

  addItem(itemId) {
    const tmpl = ITEMS.find(i => i.id === itemId);
    if (!tmpl) return false;
    this.items.push({ ...tmpl });
    return true;
  }

  removeItem(itemId) {
    const idx = this.items.findIndex(i => i.id === itemId);
    if (idx === -1) return false;
    if (this.equipped === itemId) this.equipped = null;
    this.items.splice(idx, 1);
    return true;
  }

  getItemsByType(type) {
    return this.items.filter(i => i.type === type);
  }

  equip(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item || item.type !== 'deco') return false;
    this.equipped = itemId;
    return true;
  }

  unequip() {
    this.equipped = null;
  }

  useGift(itemId, charId, relEngine) {
    const idx = this.items.findIndex(i => i.id === itemId);
    if (idx === -1) return null;
    const item = this.items[idx];
    if (item.type !== 'gift') return null;
    const effects = item.effect || {};
    for (const [field, delta] of Object.entries(effects)) {
      if (field === 'energy') continue;
      relEngine.applyDelta(charId, field, delta);
    }
    this.items.splice(idx, 1);
    return effects;
  }

  useFood(itemId) {
    const idx = this.items.findIndex(i => i.id === itemId);
    if (idx === -1) return null;
    const item = this.items[idx];
    if (item.type !== 'food') return null;
    const energyGain = item.effect?.energy || 0;
    this.items.splice(idx, 1);
    return energyGain;
  }

  getJobs() { return [...JOBS]; }

  doJob(jobId, calEngine) {
    const job = JOBS.find(j => j.id === jobId);
    if (!job) return null;
    if (!calEngine.canAct() || calEngine.energy < job.energyCost) return null;
    calEngine.spendEnergy(job.energyCost);
    this.earn(job.reward);
    return { reward: job.reward, energyCost: job.energyCost };
  }
}
