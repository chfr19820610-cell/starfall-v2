export class EventBus {
  constructor() {
    this._handlers = {};
  }

  on(event, cb) {
    if (!this._handlers[event]) this._handlers[event] = [];
    this._handlers[event].push(cb);
    return () => this.off(event, cb);
  }

  off(event, cb) {
    if (!this._handlers[event]) return;
    this._handlers[event] = this._handlers[event].filter(h => h !== cb);
  }

  emit(event, data) {
    if (!this._handlers[event]) return;
    for (const cb of this._handlers[event]) {
      try { cb(data); } catch (e) { console.warn(`EventBus[${event}] error:`, e); }
    }
  }

  once(event, cb) {
    const wrapper = (data) => {
      this.off(event, wrapper);
      cb(data);
    };
    this.on(event, wrapper);
  }
}
