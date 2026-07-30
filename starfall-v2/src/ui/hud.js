export class HUD {
  constructor(container, eventBus, relEngine) {
    this.el = container;
    this.eb = eventBus;
    this.rel = relEngine;
    this.eb.on('hud:update', () => this.update());
  }

  render() {
    this.el.innerHTML = `<div class="hud-bar" id="hud-bar">
      <span class="hud-time" id="hud-time">第1章 第1天 上午</span>
      <span class="hud-energy" id="hud-energy">⚡3</span>
      <span class="hud-currency" id="hud-currency">✦0</span>
    </div>
    <div class="hud-rels" id="hud-rels"></div>`;
  }

  update() {
    this.eb.emit('hud:refresh');
  }

  showCalendar(calState) {
    const el = document.getElementById('hud-time');
    if (el) {
      el.textContent = calState?.getTimeLabel ? calState.getTimeLabel() : '';
    }
  }

  showEnergy(energy) {
    const el = document.getElementById('hud-energy');
    if (el) el.textContent = `⚡${energy}`;
  }

  showCurrency(amount) {
    const el = document.getElementById('hud-currency');
    if (el) el.textContent = `✦${amount}`;
  }

  showRelationship(charId) {
    const relEl = document.getElementById('hud-rels');
    if (!relEl || !this.rel) return;
    const stage = this.rel.getStageName(charId);
    if (charId === 'narrator') return;
    relEl.innerHTML = `<span class="hud-rel">${charId}: ${stage}</span>`;
  }
}
