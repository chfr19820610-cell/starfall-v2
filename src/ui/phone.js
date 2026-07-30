export class PhoneUI {
  constructor(container, eventBus) {
    this.el = container;
    this.eb = eventBus;
  }

  render() {
    this.el.innerHTML = `<div class="phone-frame">
      <div class="phone-header">星落之夜</div>
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
    if (existing) existing.remove();
    const panel = document.createElement('div');
    panel.className = 'phone-panel';
    panel.innerHTML = `<div class="phone-panel-header">
      <button class="panel-close">✕</button>
      <span>${appId}</span>
    </div>
    <div class="phone-panel-body">${content}</div>`;
    panel.querySelector('.panel-close').addEventListener('click', () => panel.remove());
    this.el.appendChild(panel);
  }
}
