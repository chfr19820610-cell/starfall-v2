const STAGES = ['陌生人', '认识', '渐暖', '亲近', '亲密', '羁绊'];
const STAGE_THRESHOLDS = [0, 10, 25, 45, 65, 85, 101];
const FIELDS = ['affection','trust','chemistry','comfort','respect','curiosity','tension'];

function defaultRel() {
  const r = {};
  for (const f of FIELDS) r[f] = 0;
  return r;
}

export class RelationshipEngine {
  constructor(state) {
    this.pcRelations = {};
    this.npcRelations = {};
    this._lastStage = {};
    this._pendingEvents = [];
    if (state) {
      if (state.pcRelations) this.pcRelations = { ...state.pcRelations };
      if (state.npcRelations) this.npcRelations = { ...state.npcRelations };
    }
  }

  getState() {
    return {
      pcRelations: JSON.parse(JSON.stringify(this.pcRelations)),
      npcRelations: { ...this.npcRelations }
    };
  }

  _ensure(charId) {
    if (!this.pcRelations[charId]) {
      this.pcRelations[charId] = defaultRel();
    }
  }

  getWarmth(charId) {
    const rel = this.pcRelations[charId];
    if (!rel) return 0;
    const pos = (rel.affection + rel.trust + rel.chemistry + rel.comfort + rel.respect) / 5;
    return Math.max(0, pos - rel.tension * 0.2);
  }

  getStage(charId) {
    const w = this.getWarmth(charId);
    for (let i = STAGE_THRESHOLDS.length - 1; i >= 0; i--) {
      if (w >= STAGE_THRESHOLDS[i]) return i;
    }
    return 0;
  }

  getStageName(charId) {
    return STAGES[this.getStage(charId)] || '陌生人';
  }

  applyDelta(charId, field, delta) {
    this._ensure(charId);
    const cur = this.pcRelations[charId][field] ?? 0;
    this.pcRelations[charId][field] = Math.max(0, Math.min(100, cur + delta));
    this._checkThresholds(charId);
  }

  _checkThresholds(charId) {
    const oldStage = this._lastStage[charId] ?? 0;
    const newStage = this.getStage(charId);
    if (newStage !== oldStage) {
      this._lastStage[charId] = newStage;
      if (newStage > oldStage) {
        this._pendingEvents.push({ type: 'stage_up', charId, stage: newStage });
      }
    }
  }

  getPendingEvents() {
    const ev = [...this._pendingEvents];
    this._pendingEvents = [];
    return ev;
  }

  setNpcRelation(charA, charB, type, strength) {
    const key = [charA, charB].sort().join('_');
    this.npcRelations[key] = { type, strength: Math.max(0, Math.min(100, strength)) };
  }

  propagateConsistency(charA, charB, delta) {
    if (delta === 0) return;
    for (const [key, rel] of Object.entries(this.npcRelations)) {
      const [a, b] = key.split('_');
      if (a !== charA && b !== charA) continue;
      const third = (a === charA ? b : a);
      if (third === charB) continue;
      if (delta > 0 && rel.type === 'friend' && rel.strength > 40) {
        this.applyDelta(third, 'affection', Math.round(delta * 0.3));
      } else if (delta > 0 && rel.type === 'rival') {
        this.applyDelta(third, 'tension', Math.round(Math.abs(delta) * 0.2));
      }
    }
  }

  getRelations(charId) {
    const result = [];
    for (const [key, rel] of Object.entries(this.npcRelations)) {
      const [a, b] = key.split('_');
      if (a === charId || b === charId) {
        result.push({ charId: a === charId ? b : a, ...rel });
      }
    }
    return result;
  }
}
