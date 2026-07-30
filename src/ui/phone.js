/**
 * 星落之夜 v2.0 — Phone UI
 * 重设计：玻璃态底部 Dock + 弹出面板 + 动画
 */

export class PhoneUI {
  constructor(container, eventBus) {
    this.el = container;
    this.eb = eventBus;
  }

  render() {
    this.el.innerHTML = `<div class="phone-frame">
      <div class="phone-header">导 航</div>
      <div class="phone-apps">
        <div class="app-icon" data-app="story">📖 剧情</div>
        <div class="app-icon" data-app="rels">💕 关系</div>
        <div class="app-icon" data-app="calendar">📅 日程</div>
        <div class="app-icon" data-app="shop">🛍️ 商店</div>
        <div class="app-icon" data-app="inventory">🎒 背包</div>
        <div class="app-icon" data-app="achievements">🏆 成就</div>
        <div class="app-icon" data-app="memories">📸 回忆</div>
        <div class="app-icon" data-app="jobs">💼 打工</div>
      </div>
    </div>`;
    this.el.querySelectorAll('.app-icon').forEach(icon => {
      icon.addEventListener('click', () => {
        const app = icon.dataset.app;
        this.eb.emit('phone:open', app);
      });
    });
  }

  showPanel(appId, content) {
    const existing = this.el.querySelector('.phone-panel');
    if (existing) {
      existing.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      existing.style.opacity = '0';
      existing.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => existing.remove(), 200);
    }

    const panel = document.createElement('div');
    panel.className = 'phone-panel';
    panel.innerHTML = `<div class="phone-panel-header">
      <button class="panel-close">✕</button>
      <span>${appId}</span>
    </div>
    <div class="phone-panel-body">${content}</div>`;
    panel.querySelector('.panel-close').addEventListener('click', () => {
      panel.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      panel.style.opacity = '0';
      panel.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => panel.remove(), 200);
    });
    this.el.appendChild(panel);
  }
}
