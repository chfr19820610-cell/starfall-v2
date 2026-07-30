export class DialogueEngine {
  constructor(relEngine, flags, dialogues) {
    this.relEngine = relEngine;
    this.flags = flags || {};
    this.dialogues = dialogues || {};
  }

  getDialogue(id) {
    const d = this.dialogues[id];
    if (!d) return null;
    if (d.variants) {
      for (const v of d.variants) {
        if (this._checkConditions(v.conditions)) {
          return {
            ...d,
            text: v.text,
            choices: v.choices || d.choices,
            _variant: true
          };
        }
      }
    }
    return { ...d };
  }

  _checkConditions(conds) {
    if (!conds) return false;
    for (const [key, rule] of Object.entries(conds)) {
      if (key === 'flags') {
        for (const f of rule) {
          if (!this.flags[f]) return false;
        }
        continue;
      }
      const match = key.match(/^(\w+)_(\w+)$/);
      if (match) {
        const field = match[1];
        const charId = match[2];
        const rel = this.relEngine.pcRelations[charId];
        const val = rel ? (rel[field] ?? 0) : 0;
        for (const [op, limit] of Object.entries(rule)) {
          if (op === 'min' && val < limit) return false;
          if (op === 'max' && val > limit) return false;
        }
      }
    }
    return true;
  }

  applyEffects(effects) {
    if (!effects) return;
    for (const [key, delta] of Object.entries(effects)) {
      const match = key.match(/^(\w+)_(\w+)$/);
      if (match) {
        const field = match[1];
        const charId = match[2];
        this.relEngine.applyDelta(charId, field, delta);
      }
    }
  }

  applyChoiceEffects(choice) {
    if (!choice) return;
    if (choice.effects) this.applyEffects(choice.effects);
    if (choice.flags) {
      for (const f of choice.flags) this.flags[f] = true;
    }
  }

  getChoices(id) {
    const d = this.dialogues[id];
    if (!d) return [];
    let choices = d.choices || [];
    if (d.variants) {
      for (const v of d.variants) {
        if (this._checkConditions(v.conditions) && v.choices) {
          choices = v.choices;
          break;
        }
      }
    }
    return choices;
  }

  getSpeaker(id) {
    const d = this.dialogues[id];
    if (!d) return null;
    return { id: d.speaker, name: d.speaker };
  }

  getNextDialogue(choiceIndex, currentId) {
    const choices = this.getChoices(currentId);
    const choice = choices[choiceIndex];
    if (!choice) {
      const d = this.dialogues[currentId];
      return d ? d.next || null : null;
    }
    this.applyChoiceEffects(choice);
    return choice.next || null;
  }

  setFlag(key, val) {
    this.flags[key] = val;
  }

  getFlag(key) {
    return !!this.flags[key];
  }
}
