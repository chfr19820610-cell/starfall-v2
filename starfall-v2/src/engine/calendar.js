export class CalendarEngine {
  constructor(state) {
    this.chapter = 1;
    this.day = 1;
    this.period = 0;
    this.weekday = 1;
    this.energy = 3;
    this.totalDaysPlayed = 0;
    this._events = [];
    if (state) {
      const hadEnergy = 'energy' in state;
      Object.assign(this, state);
      if (!hadEnergy) this.energy = this._maxEnergy();
    }
  }

  getState() {
    return {
      chapter: this.chapter,
      day: this.day,
      period: this.period,
      weekday: this.weekday,
      energy: this.energy,
      totalDaysPlayed: this.totalDaysPlayed
    };
  }

  _weekend() {
    return this.weekday === 0 || this.weekday === 6;
  }

  _maxEnergy() {
    return this._weekend() ? 4 : 3;
  }

  advancePeriod() {
    this.period++;
    if (this.period > 3) {
      this.period = 0;
      this.day++;
      this.totalDaysPlayed++;
      this.weekday = (this.weekday + 1) % 7;
      this.energy = this._maxEnergy();
    }
    this._events = this._checkEvents();
    return { events: this._events, state: this.getState() };
  }

  canAct() {
    return this.energy > 0;
  }

  spendEnergy(n) {
    this.energy = Math.max(0, this.energy - Math.abs(n));
  }

  restoreEnergy() {
    this.energy = this._maxEnergy();
  }

  _checkEvents() {
    // TODO: 未来从数据层加载基于 chapter_day_period 的事件
    return [];
  }

  getTimeLabel() {
    const periods = ['上午', '下午', '晚上', '深夜'];
    return `第${this.chapter}章 第${this.day}天 ${periods[this.period] || ''}`;
  }

  getSeason() {
    if (this.chapter <= 1) return '秋';
    if (this.chapter <= 2) return '冬';
    if (this.chapter <= 3) return '春';
    return '夏';
  }
}
