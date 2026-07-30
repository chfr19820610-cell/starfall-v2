import achievements from '../data/achievements.js';

export class AchievementSystem {
  constructor(stateManager, relEngine) {
    this.sm = stateManager;
    this.relEngine = relEngine;
  }

  checkAll() {
    const unlocked = [];
    for (const ach of achievements) {
      if (this.sm.achievements[ach.id]?.unlocked) continue;
      try {
        if (ach.check(this.sm, this.relEngine, null)) {
          this.sm.unlockAchievement(ach.id);
          unlocked.push(ach);
        }
      } catch {}
    }
    return unlocked;
  }

  getAchievements() {
    return achievements.map(a => ({
      ...a,
      unlocked: !!this.sm.achievements[a.id]?.unlocked,
      time: this.sm.achievements[a.id]?.time || null
    }));
  }

  getProgress() {
    const total = achievements.length;
    const unlocked = Object.keys(this.sm.achievements).length;
    return `${unlocked}/${total}`;
  }
}
