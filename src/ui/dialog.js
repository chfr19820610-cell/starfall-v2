/**
 * 星落之夜 v2.0 — Dialog Renderer
 * 重设计：玻璃态面板 + 增强打字机 + 入场动画
 */

export class DialogRenderer {
  constructor(container, eventBus) {
    this.el = container;
    this.eb = eventBus;
    this.typeSpeed = 28;
    this._timer = null;
    this._text = '';
    this._idx = 0;
    this._controller = null;
    this._callbacks = {};
  }

  showDialogue(node, speakerName) {
    // Cancel any ongoing animation
    this._cancelType();

    const name = speakerName || node.speaker || '';
    const sceneClass = `dialog-scene dialog-scene--${node.scene || 'default'}`;

    // Build the panel with enhanced structure
    let speakerHtml = '';
    if (name) {
      speakerHtml = `<div class="dialog-speaker">
        <span class="dialog-speaker-text">${this._escapeHtml(name)}</span>
      </div>`;
    }

    const html = `<div class="${sceneClass}">
      ${speakerHtml}
      <div class="dialog-text typing" id="dialog-text"></div>
    </div>`;

    this.el.innerHTML = html;
    this._text = node.text || '';
    this._idx = 0;

    // Stagger animation for choices container
    // Start typing
    this._type();
  }

  _type() {
    const textEl = document.getElementById('dialog-text');
    if (!textEl) return;

    // Use a more reliable approach — requestAnimationFrame + interval
    const step = () => {
      if (this._controller?.signal.aborted) {
        textEl.classList.remove('typing');
        return;
      }

      if (this._idx < this._text.length) {
        // Batch a few characters per step for speed
        const batchSize = 1;
        let endIdx = Math.min(this._idx + batchSize, this._text.length);
        textEl.textContent = this._text.slice(0, endIdx);
        this._idx = endIdx;
      } else {
        textEl.classList.remove('typing');
        this._controller = null;
      }
    };

    // First character immediately
    textEl.textContent = this._text[0] || '';
    this._idx = 1;

    this._controller = new AbortController();
    this._timer = setInterval(() => {
      if (this._controller?.signal.aborted) {
        clearInterval(this._timer);
        this._timer = null;
        return;
      }
      if (this._idx < this._text.length) {
        textEl.textContent = this._text.slice(0, this._idx + 1);
        this._idx++;
      } else {
        textEl.classList.remove('typing');
        clearInterval(this._timer);
        this._timer = null;
      }
    }, this.typeSpeed);
  }

  _cancelType() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    if (this._controller) {
      this._controller.abort();
      this._controller = null;
    }
    const textEl = document.getElementById('dialog-text');
    if (textEl) {
      if (this._text) textEl.textContent = this._text;
      textEl.classList.remove('typing');
    }
  }

  skipAnimation() {
    this._cancelType();
    const textEl = document.getElementById('dialog-text');
    if (textEl) {
      textEl.textContent = this._text;
      textEl.classList.remove('typing');
    }
  }

  isTyping() {
    return this._timer !== null || this._controller !== null;
  }

  showChoices(choices) {
    if (!choices || choices.length === 0) return;

    // Clear any remaining cursor from choices
    const textEl = document.getElementById('dialog-text');
    if (textEl) {
      textEl.classList.remove('typing');
    }

    // Stagger choice button appearance
    const html = `<div class="dialog-choices">${choices.map((c, i) =>
      `<button class="choice-btn" data-idx="${i}" style="animation-delay:${i * 0.06}s">${this._escapeHtml(c.text || '继续')}</button>`
    ).join('')}</div>`;
    this.el.insertAdjacentHTML('beforeend', html);

    this.el.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        if (this._callbacks.onChoice) this._callbacks.onChoice(idx);
      });
    });
  }

  onChoice(cb) {
    this._callbacks.onChoice = cb;
  }

  hide() {
    this._cancelType();
    this.el.innerHTML = '';
  }

  setTypeSpeed(ms) {
    this.typeSpeed = ms;
  }

  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
