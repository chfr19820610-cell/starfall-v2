// RelationshipEngine unit tests
import { RelationshipEngine } from '../engine/relationship.js';

function assert(cond, msg) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`PASS: ${msg}`);
}

function run() {
  // Test 1: Default pcRelations empty
  const rel = new RelationshipEngine();
  assert(Object.keys(rel.pcRelations).length === 0, 'Initially empty');

  // Test 2: applyDelta creates default entry
  rel.applyDelta('lyra', 'affection', 30);
  assert(rel.pcRelations.lyra.affection === 30, 'affection=30');
  assert(rel.pcRelations.lyra.trust === 0, 'trust defaults to 0');

  // Test 3: applyDelta clamps to 0-100
  rel.applyDelta('lyra', 'affection', 200);
  assert(rel.pcRelations.lyra.affection === 100, 'Clamp max 100');
  rel.applyDelta('lyra', 'affection', -500);
  assert(rel.pcRelations.lyra.affection === 0, 'Clamp min 0');

  // Test 4: getWarmth calculation
  rel.applyDelta('lyra', 'affection', 50);
  rel.applyDelta('lyra', 'trust', 50);
  rel.applyDelta('lyra', 'chemistry', 50);
  rel.applyDelta('lyra', 'comfort', 50);
  rel.applyDelta('lyra', 'respect', 50);
  rel.applyDelta('lyra', 'tension', 10);
  // Warmth = (50+50+50+50+50)/5 - 10*0.2 = 50 - 2 = 48
  const warmth = rel.getWarmth('lyra');
  assert(Math.abs(warmth - 48) < 0.1, `Warmth=48 (got ${warmth})`);

  // Test 5: getStage mapping
  rel.pcRelations.lyra = { affection: 0, trust: 0, chemistry: 0, comfort: 0, respect: 0, curiosity: 0, tension: 0 };
  assert(rel.getStage('lyra') === 0, 'Default = 陌生人');
  // warmth = (a+t+ch+co+r)/5 - t*0.2. Need warmth >=10 for stage 1
  // So sum of 5 dims needs to be >= 50 with no tension
  rel.applyDelta('lyra', 'affection', 50);
  assert(rel.getStage('lyra') === 1, 'warmth 10+ = 认识');
  rel.applyDelta('lyra', 'trust', 25);
  rel.applyDelta('lyra', 'chemistry', 50);
  rel.applyDelta('lyra', 'comfort', 50);
  // warmth = (50+25+50+50+0)/5 = 35. >=25 -> stage 2
  assert(rel.getStage('lyra') >= 2, 'warmth 25+ = 渐暖');
  // Push to stage 3: need warmth >=45, so sum>=225
  rel.applyDelta('lyra', 'respect', 80);
  // warmth = (50+25+50+50+80)/5 = 51. >=45 -> stage 3
  assert(rel.getStage('lyra') >= 3, 'warmth 45+ = 亲近');
  // Push to stage 4: need warmth >=65, so sum>=325
  rel.applyDelta('lyra', 'affection', 30);
  rel.applyDelta('lyra', 'respect', 20);
  rel.applyDelta('lyra', 'trust', 30);
  rel.applyDelta('lyra', 'chemistry', 10);
  // warmth = (80+55+60+50+100)/5 = 69. >=65 -> stage 4
  assert(rel.getStage('lyra') >= 4, 'warmth 65+ = 亲密');
  // Push to stage 5: need warmth >=85
  rel.applyDelta('lyra', 'affection', 20);
  // warmth = (100+55+60+50+100)/5 = 73... still not 85+.
  // Need to add more: 85*5 = 425 total needed
  rel.applyDelta('lyra', 'trust', 20);
  rel.applyDelta('lyra', 'chemistry', 20);
  rel.applyDelta('lyra', 'comfort', 50);
  // warmth = (100+75+80+100+100)/5 = 91. >=85 -> stage 5
  assert(rel.getStage('lyra') >= 5, 'warmth 85+ = 羁绊');

  // Test 6: Stage name (Chinese)
  const rel2 = new RelationshipEngine();
  rel2.applyDelta('kai', 'affection', 50);
  rel2.applyDelta('kai', 'trust', 50);
  rel2.applyDelta('kai', 'chemistry', 50);
  rel2.applyDelta('kai', 'comfort', 50);
  rel2.applyDelta('kai', 'respect', 50);
  // warmth = (50*5)/5 = 50 -> stage 3 (45-65) = 亲近
  assert(rel2.getStageName('kai') === '亲近', 'Stage name Chinese: 亲近');

  // Test 7: Pending events on stage up
  const rel3 = new RelationshipEngine();
  rel3.applyDelta('selene', 'affection', 100);
  const events = rel3.getPendingEvents();
  assert(events.length > 0, 'Stage up generates events');
  assert(events[0].type === 'stage_up', 'Event type: stage_up');
  assert(events[0].charId === 'selene', 'Event charId: selene');

  // Test 8: Event cleared after getPendingEvents
  const events2 = rel3.getPendingEvents();
  assert(events2.length === 0, 'Events cleared after consume');

  // Test 9: setNpcRelation
  const rel4 = new RelationshipEngine();
  rel4.setNpcRelation('lyra', 'kai', 'friend', 70);
  const key = ['lyra', 'kai'].sort().join('_');
  assert(rel4.npcRelations[key].type === 'friend', 'NPC relation type');
  assert(rel4.npcRelations[key].strength === 70, 'NPC relation strength');

  // Test 10: getRelations
  const rel5 = new RelationshipEngine();
  rel5.setNpcRelation('lyra', 'kai', 'friend', 70);
  rel5.setNpcRelation('lyra', 'selene', 'friend', 40);
  const lyraRels = rel5.getRelations('lyra');
  assert(lyraRels.length === 2, 'lyra has 2 relations');
  assert(lyraRels.some(r => r.type === 'friend'), 'All are friends');

  console.log('\n=== RelationshipEngine: ALL 10 TESTS PASSED ===');
}

run();
