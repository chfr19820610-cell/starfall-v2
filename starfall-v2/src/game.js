import { CalendarEngine } from './engine/calendar.js';
import { SaveSystem } from './engine/save.js';
import { EventBus } from './lib/eventbus.js';
import { StateManager } from './engine/state.js';
import { RelationshipEngine } from './engine/relationship.js';
import { DialogueEngine } from './engine/dialogue.js';
import { EconomySystem } from './systems/economy.js';
import { AchievementSystem } from './systems/achievements.js';
import { DialogRenderer } from './ui/dialog.js';
import { HUD } from './ui/hud.js';
import { PhoneUI } from './ui/phone.js';
import scenes from './data/scenes.js';
import { PERIOD_NAMES, SCENE_BG } from './data/constants.js';
import { ITEMS } from './data/items.js';

export class Game {
  constructor(container) {
    this.calendar = new CalendarEngine();
    this.saveSys = new SaveSystem();
    this.eb = new EventBus();
    this.state = new StateManager(this.saveSys, this.eb);
    this.rel = new RelationshipEngine();
    this.dialogue = new DialogueEngine(this.rel, this.state.flags, scenes);
    this.economy = new EconomySystem();
    this.achievements = new AchievementSystem(this.state, this.rel);

    this.dialogEl = container.querySelector('#dialog-area');
    this.hudEl = container.querySelector('#hud-area');
    this.phoneEl = container.querySelector('#phone-area');
    this.sceneEl = container.querySelector('#scene-bg');

    this.dialog = new DialogRenderer(this.dialogEl, this.eb);
    this.hud = new HUD(this.hudEl, this.eb, this.rel);
    this.phone = new PhoneUI(this.phoneEl, this.eb);
    this._initCharacters();
    this._initEvents();
  }

  _initCharacters() {
    this.rel.applyDelta('lyra', 'curiosity', 10);
    this.rel.applyDelta('kai', 'curiosity', 5);
    this.rel.applyDelta('selene', 'curiosity', 15);
    this.rel.setNpcRelation('lyra', 'kai', 'friend', 70);
    this.rel.setNpcRelation('lyra', 'selene', 'friend', 40);
    this.rel.setNpcRelation('kai', 'selene', 'friend', 30);
  }

  _initEvents() {
    this.dialog.onChoice((idx) => this._handleChoice(idx));
    this.eb.on('phone:open', (app) => this._openApp(app));
    this.eb.on('ach:unlock', (id) => this._showAchievement(id));
    this.eb.on('hud:refresh', () => this._refreshHUD());
  }

  async init() {
    this.hud.render();
    this.phone.render();
    const saved = await this.saveSys.loadAutoSave();
    if (saved) {
      if (saved.version === 1) {
        const migrated = this.saveSys.migrateV1(saved);
        this.state.loadState(migrated);
        if (migrated.calendar) this.calendar = new CalendarEngine(migrated.calendar);
        if (migrated.relationships) this.rel = new RelationshipEngine(migrated.relationships);
        if (migrated.inventory) this.economy = new EconomySystem(migrated.inventory);
      } else {
        if (saved.flags) this.state.loadState(saved);
        if (saved.calendar) this.calendar = new CalendarEngine(saved.calendar);
        if (saved.relationships) this.rel = new RelationshipEngine(saved.relationships);
        if (saved.inventory) this.economy = new EconomySystem(saved.inventory);
      }
    }
    this._refreshHUD();
    this._showNode('ch0_intro');
  }

  _showNode(id) {
    this._currentNodeId = id;
    const node = this.dialogue.getDialogue(id);
    if (!node) {
      this.dialogEl.innerHTML = '<div class="dialog-error">故事还在编写中……</div>';
      return;
    }
    this.dialogue.applyEffects(node.effects);
    this.state.recordDialogue();
    this._setScene(node.scene);
    this.dialog.showDialogue(node, this._speakerName(node.speaker));
    const choices = this.dialogue.getChoices(id);
    const delay = Math.min(node.text.length * (this.dialog.typeSpeed || 30) + 500, 5000);
    setTimeout(() => {
      if (choices.length > 0) this.dialog.showChoices(choices);
    }, delay);
  }

  _handleChoice(idx) {
    const currentId = this._currentNodeId;
    if (!currentId) return;
    const nextId = this.dialogue.getNextDialogue(idx, currentId);
    this.state.recordChoice();
    this._checkAchievements();
    if (!nextId) return;
    if (this._isEnding(nextId)) {
      const endingId = this._resolveEnding(nextId);
      this.state.addEnding(endingId);
    }
    this.calendar.advancePeriod();
    if (this.state.memories.length === 0 && currentId.startsWith('ch') && nextId.startsWith('ch')) {
      this.state.addMemory({ id: `mem_${currentId}`, title: currentId, chapter: this.calendar.chapter, day: this.calendar.day });
    }
    this._refreshHUD();
    this._showNode(nextId);
  }

  _isEnding(id) { return id && id.startsWith('end_'); }

  _resolveEnding(id) {
    if (id.startsWith('end_') || id.startsWith('epilogue_')) return id;
    return id;
  }

  _setScene(scene) {
    if (!this.sceneEl) return;
    const bg = SCENE_BG[scene] || '#0a0a2e';
    this.sceneEl.style.background = bg;
  }

  _speakerName(id) {
    const names = { lyra: 'Lyra', kai: 'Kai', selene: 'Selene', narrator: '' };
    return names[id] || id || '';
  }

  _refreshHUD() {
    this.hud.showCalendar(this.calendar);
    this.hud.showEnergy(this.calendar.energy);
    this.hud.showCurrency(this.economy.getBalance());
    this.hud.showRelationship('lyra');
    this.hud.showRelationship('kai');
    this.hud.showRelationship('selene');
  }

  _checkAchievements() {
    const unlocked = this.achievements.checkAll();
    for (const ach of unlocked) {
      this._showAchievement(ach.id);
    }
  }

  _showAchievement(id) {
    const ach = this.achievements.getAchievements().find(a => a.id === id);
    if (!ach) return;
    const tierColors = { bronze: '#cd7f32', silver: '#c0c0c0', gold: '#ffd700', star: '#00bfff' };
    const toast = document.createElement('div');
    toast.className = 'ach-toast';
    toast.innerHTML = `<span style="color:${tierColors[ach.tier] || '#fff'}">🏆</span> ${ach.name} — ${ach.desc}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  _openApp(app) {
    let content = '';
    switch (app) {
      case 'story': content = '<p>主线剧情 [进行中]</p>'; break;
      case 'rels': content = this._renderRels(); break;
      case 'calendar': content = this._renderCalendar(); break;
      case 'shop': content = this._renderShop(); break;
      case 'inventory': content = this._renderInventory(); break;
      case 'achievements': content = this._renderAchievements(); break;
      case 'memories': content = this._renderMemories(); break;
      case 'jobs': content = this._renderJobs(); break;
      default: content = '<p>功能开发中</p>';
    }
    this.phone.showPanel(app, content);
    this._bindPanelEvents();
  }

  _renderRels() {
    const chars = ['lyra', 'kai', 'selene'];
    return `<div class="rel-list">${chars.map(c => `
      <div class="rel-card">
        <strong>${this._speakerName(c)}</strong>
        <span>${this.rel.getStageName(c)} (温暖度:${Math.round(this.rel.getWarmth(c))})</span>
        <div class="rel-bar"><div class="rel-fill" style="width:${Math.min(100, this.rel.getWarmth(c))}%"></div></div>
      </div>`).join('')}</div>`;
  }

  _renderCalendar() {
    const cal = this.calendar;
    return `<p>第${cal.chapter}章 第${cal.day}天 ${PERIOD_NAMES[cal.period] || ''}</p>
      <p>行动点: ${'⚡'.repeat(cal.energy)}${'·'.repeat(Math.max(0, (cal._weekend ? 4 : 3) - cal.energy))}</p>
      <p>季节: ${cal.getSeason()}</p>`;
  }

  _renderShop() {
    const items = ITEMS.filter(i => i.type !== 'food');
    return `<div class="shop-list">${items.map(i => `
      <div class="shop-item">
        <span>${i.icon} ${i.name}</span>
        <span>✦${i.price}</span>
        <button class="buy-btn" data-id="${i.id}">购买</button>
      </div>`).join('')}</div>`;
  }

  _renderInventory() {
    const items = this.economy.items;
    if (items.length === 0) return '<p>背包是空的。</p>';
    return `<div class="inv-list">${items.map(i => `
      <div class="inv-item">
        <span>${i.icon || '📦'} ${i.name}</span>
        <span class="inv-type">${i.type}</span>
        ${i.type === 'gift' ? `<button class="gift-btn" data-id="${i.id}">送礼</button>` : ''}
        ${i.type === 'deco' ? `<button class="equip-btn" data-id="${i.id}">${this.economy.equipped === i.id ? '已装备' : '装备'}</button>` : ''}
      </div>`).join('')}</div>`;
  }

  _renderJobs() {
    const jobs = this.economy.getJobs();
    return `<div class="job-list">${jobs.map(j => `
      <div class="job-item">
        <strong>${j.name}</strong>
        <span>✦${j.reward} | 消耗⚡${j.energyCost}</span>
        <br><small>${j.desc}</small>
        <button class="work-btn" data-id="${j.id}">${this.calendar.canAct() && this.calendar.energy >= j.energyCost ? '干活' : '能量不足'}</button>
      </div>`).join('')}</div>`;
  }

  _renderAchievements() {
    const list = this.achievements.getAchievements();
    const tierS = { bronze: '铜', silver: '银', gold: '金', star: '星辉' };
    return `<div class="ach-list">${list.map(a => `
      <div class="ach-item ${a.unlocked ? 'ach-unlocked' : 'ach-locked'}">
        ${a.unlocked ? '⭐' : '☆'} ${a.name} (${tierS[a.tier] || ''})
        ${a.unlocked ? `<br><small>${a.desc}</small>` : '<br><small>???</small>'}
      </div>`).join('')}</div>`;
  }

  _renderMemories() {
    const mems = this.state.memories;
    if (mems.length === 0) return '<p>还没有收集到回忆。</p>';
    return `<div class="mem-list">${mems.map(m => `
      <div class="mem-item"><strong>${m.title || m.id}</strong></div>`).join('')}</div>`;
  }

  _bindPanelEvents() {}
}
