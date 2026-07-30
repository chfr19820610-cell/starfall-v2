// DialogueEngine unit tests
import { DialogueEngine } from '../engine/dialogue.js';
import { RelationshipEngine } from '../engine/relationship.js';

function assert(cond, msg) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`PASS: ${msg}`);
}

const TEST_DIALOGUES = {
  test_default: {
    id: 'test_default',
    speaker: 'lyra',
    text: '你好。',
    scene: 'square',
    next: 'test_default2',
    variants: [
      { conditions: { affection_lyra: { min: 60 }, flags: ['talk_lyra'] }, text: '你来了！我等你很久了。' },
      { conditions: { affection_lyra: { max: 20 } }, text: '呃。又是你。' }
    ],
    effects: { affection_lyra: 2 }
  },
  test_default2: {
    id: 'test_default2',
    speaker: 'kai',
    text: '嘿。',
    scene: 'street',
    choices: [
      { text: '选项A', effects: { affection_kai: 5 }, next: 'test_end' },
      { text: '选项B', next: 'test_end' }
    ]
  },
  test_end: {
    id: 'test_end',
    speaker: 'narrator',
    text: '结束',
    scene: 'night'
  },
  test_missing: null,
  test_effect_choices: {
    id: 'test_effect_choices',
    speaker: 'selene',
    text: '选吧',
    scene: 'stargaze',
    choices: [
      { text: 'A', effects: { affection_selene: 5 }, flags: ['chose_a'], next: 'test_end' },
      { text: 'B', next: 'test_end' }
    ]
  }
};

function run() {
  const rel = new RelationshipEngine();
  rel.applyDelta('lyra', 'affection', 30);
  const flags = { talk_lyra: false };

  // Test 1: Low affection -> 默认变体
  const de1 = new DialogueEngine(rel, { ...flags }, TEST_DIALOGUES);
  const d1 = de1.getDialogue('test_default');
  // affection=30, max:20 false, min:60 false -> default text
  assert(d1.text === '你好。', 'Low affection returns default text');

  // Test 2: High affection + flag -> 变体
  const rel2 = new RelationshipEngine();
  rel2.applyDelta('lyra', 'affection', 70);
  const de2 = new DialogueEngine(rel2, { talk_lyra: true }, TEST_DIALOGUES);
  const d2 = de2.getDialogue('test_default');
  assert(d2.text === '你来了！我等你很久了。', 'High affection+flag returns variant text');

  // Test 3: applyEffects
  const rel3 = new RelationshipEngine();
  const de3 = new DialogueEngine(rel3, {}, TEST_DIALOGUES);
  de3.applyEffects({ affection_lyra: 10, trust_lyra: 5 });
  assert(rel3.pcRelations.lyra.affection === 10, 'applyEffects: affection=10');
  assert(rel3.pcRelations.lyra.trust === 5, 'applyEffects: trust=5');

  // Test 4: Missing ID returns null
  const de4 = new DialogueEngine(rel, {}, TEST_DIALOGUES);
  assert(de4.getDialogue('nonexistent') === null, 'Missing id returns null');

  // Test 5: Missing variant (undefined condition) treated as null
  const de5 = new DialogueEngine(rel, {}, TEST_DIALOGUES);
  const d5 = de5.getDialogue('test_missing');
  assert(d5 === null, 'Null dialogue returns null');

  // Test 6: getChoices returns default
  const de6 = new DialogueEngine(rel, {}, TEST_DIALOGUES);
  const choices = de6.getChoices('test_default2');
  assert(choices.length === 2, 'test_default2 has 2 choices');

  // Test 7: getSpeaker
  const de7 = new DialogueEngine(rel, {}, TEST_DIALOGUES);
  const speaker = de7.getSpeaker('test_default');
  assert(speaker.id === 'lyra', 'Speaker id = lyra');

  // Test 8: getNextDialogue and choice effects
  const de8 = new DialogueEngine(rel, {}, TEST_DIALOGUES);
  const nextId = de8.getNextDialogue(0, 'test_default2');
  assert(nextId === 'test_end', 'Choice A goes to test_end');
  assert(rel.pcRelations.kai.affection === 5, 'Choice A applied: affection_kai=5');

  // Test 9: Choice flags
  const rel9 = new RelationshipEngine();
  const de9 = new DialogueEngine(rel9, {}, TEST_DIALOGUES);
  de9.getNextDialogue(0, 'test_effect_choices');
  assert(de9.getFlag('chose_a') === true, 'Choice flag chose_a set');

  // Test 10: Condition with multiple requirements
  const rel10 = new RelationshipEngine();
  rel10.applyDelta('lyra', 'affection', 70);
  const de10 = new DialogueEngine(rel10, { talk_lyra: false }, TEST_DIALOGUES);
  const d10 = de10.getDialogue('test_default');
  // affection=70 meets min:60, but flag talk_lyra is false -> default
  assert(d10.text === '你好。', 'Partial condition (warmth ok but flag missing) -> default');

  // Reload with both conditions met
  const de10b = new DialogueEngine(rel10, { talk_lyra: true }, TEST_DIALOGUES);
  const d10b = de10b.getDialogue('test_default');
  assert(d10b.text === '你来了！我等你很久了。', 'Both conditions met -> variant');

  console.log('\n=== DialogueEngine: ALL 10 TESTS PASSED ===');
}

run();
