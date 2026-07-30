// EconomySystem unit tests
import { EconomySystem } from '../systems/economy.js';
import { RelationshipEngine } from '../engine/relationship.js';

function assert(cond, msg) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`PASS: ${msg}`);
}

function run() {
  // Test 1: Default state
  const eco = new EconomySystem();
  assert(eco.getBalance() === 0, 'Initial balance 0');
  assert(eco.items.length === 0, 'Initial inventory empty');
  assert(eco.equipped === null, 'Initial equipped null');

  // Test 2: Earn
  eco.earn(100);
  assert(eco.getBalance() === 100, 'Earn 100 -> balance 100');

  // Test 3: Spend
  assert(eco.canAfford(50) === true, 'canAfford 50');
  assert(eco.spend(50) === true, 'Spend 50 success');
  assert(eco.getBalance() === 50, 'Balance 50 after spend');

  // Test 4: canAfford false
  assert(eco.canAfford(100) === false, 'Cannot afford 100');

  // Test 5: Add item
  assert(eco.addItem('gift_flower') === true, 'Add gift_flower');
  assert(eco.items.length === 1, '1 item in inventory');
  assert(eco.items[0].name === '星辰花', 'Item name correct');

  // Test 6: Remove item
  assert(eco.removeItem('gift_flower') === true, 'Remove gift_flower');
  assert(eco.items.length === 0, '0 items after remove');

  // Test 7: Use gift
  const rel = new RelationshipEngine();
  eco.earn(200);
  eco.addItem('gift_flower');
  eco.addItem('gift_gem');
  const effects = eco.useGift('gift_flower', 'lyra', rel);
  assert(effects !== null, 'useGift returns effects');
  assert(effects.affection === 5, 'Gift effect: affection+5');
  assert(rel.pcRelations.lyra.affection === 5, 'Relation updated by gift');
  assert(eco.items.length === 1, '1 item left after gifting');

  // Test 8: Equip/unequip
  eco.addItem('deco_pin');
  assert(eco.equip('deco_pin') === true, 'Equip deco_pin');
  assert(eco.equipped === 'deco_pin', 'Equipped set');
  eco.unequip();
  assert(eco.equipped === null, 'Unequipped null');

  // Test 9: getJobs returns all
  const jobs = eco.getJobs();
  assert(jobs.length >= 4, 'At least 4 jobs available');

  // Test 10: State serialization
  const eco2 = new EconomySystem({ currency: 500, items: [{ id: 'test' }], equipped: 'deco_pin' });
  assert(eco2.getBalance() === 500, 'Restore currency from state');
  assert(eco2.items.length === 1, 'Restore items from state');

  console.log('\n=== EconomySystem: ALL 10 TESTS PASSED ===');
}

run();
