export class DialogRenderer {
  constructor(container, eventBus) {
    this.el = container;
    this.eb = eventBus;
    this.typeSpeed = 30;
    this._timer = null;
    this._text = '';
    this._idx = 0;
    this._skipped = false;
    this._callbacks = {};
  }

  showDialogue(node, speakerName) {
    this._skipped = false;
    const name = speakerName || node.speaker || '';
    const html = `<div class="dialog-scene dialog-scene--${node.scene || 'default'}">
      <div class="dialog-speaker">${name}</div>
      <div class="dialog-text" id="dialog-text"></div>
    </div>`;
    this.el.innerHTML = html;
    this._text = node.text || '';
    this._idx = 0;
    this._type();
  }

  _type() {
    const textEl = document.getElementById('dialog-text');
    if (!textEl) return;
    this._timer = setInterval(() => {
      if (this._skipped) {
        textEl.textContent = this._text;
        clearInterval(this._timer);
        this._timer = null;
        return;
      }
      if (this._idx < this._text.length) {
        textEl.textContent += this._text[this._idx];
        this._idx++;
      } else {
        clearInterval(this._timer);
        this._timer = null;
      }
    }, this.typeSpeed);
  }

  skipAnimation() {
    this._skipped = true;
  }

  showChoices(choices) {
    if (!choices || choices.length === 0) return;
    const html = `<div class="dialog-choices">${choices.map((c, i) =>
      `<button class="choice-btn" data-idx="${i}">${c.text || '继续'}</button>`
    ).join('')}</div>`;
    this.el.insertAdjacentHTML('beforeend', html);
    this.el.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        if (this._callbacks.onChoice) this._callbacks.onChoice(idx);
      });
    });
  }

  onChoice(cb) { this._callbacks.onChoice = cb; }

  hide() { this.el.innerHTML = ''; }

  setTypeSpeed(ms) { this.typeSpeed = ms; }
}
