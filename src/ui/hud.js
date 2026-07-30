/**
 * 星落之夜 v2.0 — HUD Renderer
 * 重设计：玻璃态 HUD + 统计徽章 + 关系标签
 */

export class HUD {
  constructor(container, eventBus, relEngine) {
    this.el = container;
    this.eb = eventBus;
    this.rel = relEngine;
    this.eb.on('hud:update', () => this.update());
  }

  render() {
    this.el.innerHTML = `<div class="hud-bar" id="hud-bar">
      <div class="hud-left">
        <span class="hud-brand">✦ 星落之夜</span>
        <span class="hud-time" id="hud-time">第1章 第1天 上午</span>
      </div>
      <div class="hud-stats">
        <span class="hud-stat hud-stat--energy" id="hud-energy">
          <span class="hud-stat-icon">⚡</span>
          <span>3</span>
        </span>
        <span class="hud-stat hud-stat--currency" id="hud-currency">
          <span class="hud-stat-icon">✦</span>
          <span>0</span>
        </span>
      </div>
    </div>
    <div class="hud-rels" id="hud-rels"></div>`;
  }

  update() {
    this.eb.emit('hud:refresh');
  }

  showCalendar(calState) {
    const el = document.getElementById('hud-time');
    if (el) {
      const label = calState?.getTimeLabel ? calState.getTimeLabel() : '';
      el.textContent = label;
    }
  }

  showEnergy(energy) {
    const el = document.getElementById('hud-energy');
    if (el) {
      const valEl = el.querySelector('span:last-child');
      if (valEl) valEl.textContent = energy;
    }
  }

  showCurrency(amount) {
    const el = document.getElementById('hud-currency');
    if (el) {
      const valEl = el.querySelector('span:last-child');
      if (valEl) valEl.textContent = amount;
    }
  }

  showRelationship(charId) {
    const relEl = document.getElementById('hud-rels');
    if (!relEl || !this.rel) return;
    if (charId === 'narrator') return;

    const stage = this.rel.getStageName(charId);
    // Color the indicator based on stage
    let stageColor = 'var(--accent-blue)';
    if (stage === 'Heart') stageColor = 'var(--accent-pink)';
    else if (stage === 'Close') stageColor = 'var(--accent-purple)';
    else if (stage === 'Friend') stageColor = 'var(--accent-cyan)';
    else if (stage === 'Acquaintance') stageColor = 'var(--accent-gold)';
    else if (stage === 'Stranger') stageColor = 'var(--text-muted)';

    relEl.innerHTML = `<span class="hud-rel">
      <span class="hud-rel-indicator" style="background:${stageColor}"></span>
      ${charId}: ${stage}
    </span>`;
  }
}
