// CalendarEngine unit tests
import { CalendarEngine } from '../engine/calendar.js';

function assert(cond, msg) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`PASS: ${msg}`);
}

function run() {
  // Test 1: Default init
  const cal = new CalendarEngine();
  assert(cal.chapter === 1, 'Default chapter=1');
  assert(cal.day === 1, 'Default day=1');
  assert(cal.period === 0, 'Default period=0');
  assert(cal.weekday === 1, 'Default weekday=1 (Monday)');
  assert(cal.energy === 3, 'Default energy=3 (weekday)');

  // Test 2: advancePeriod cycles 早→午→晚→夜
  const cal2 = new CalendarEngine();
  assert(cal2.period === 0, 'Start: 上午');
  cal2.advancePeriod();
  assert(cal2.period === 1, 'After 1: 下午');
  cal2.advancePeriod();
  assert(cal2.period === 2, 'After 2: 晚上');
  cal2.advancePeriod();
  assert(cal2.period === 3, 'After 3: 深夜');
  cal2.advancePeriod();
  assert(cal2.period === 0, 'After 4: back to 上午 (next day)');
  assert(cal2.day === 2, 'Day advanced to 2');
  assert(cal2.totalDaysPlayed === 1, 'totalDaysPlayed=1');

  // Test 3: Weekend energy=4
  const cal3 = new CalendarEngine({ weekday: 0 });
  assert(cal3.energy === 4, 'Sunday energy=4');
  const cal4 = new CalendarEngine({ weekday: 6 });
  assert(cal4.energy === 4, 'Saturday energy=4');

  // Test 4: Energy resets on new day
  const cal5 = new CalendarEngine();
  cal5.spendEnergy(2);
  assert(cal5.energy === 1, 'Spent 2 -> energy=1');
  // advance to next day
  cal5.advancePeriod(); cal5.advancePeriod(); cal5.advancePeriod(); cal5.advancePeriod();
  assert(cal5.energy === 3, 'New day resets to 3');

  // Test 5: canAct
  const cal6 = new CalendarEngine();
  assert(cal6.canAct() === true, 'canAct true when energy>0');
  cal6.spendEnergy(3);
  assert(cal6.canAct() === false, 'canAct false when energy=0');

  // Test 6: spendEnergy clamps negative
  const cal7 = new CalendarEngine();
  cal7.spendEnergy(-10);
  assert(cal7.energy === 0, 'spendEnergy clamps to 0');

  // Test 7: getTimeLabel
  const cal8 = new CalendarEngine();
  assert(cal8.getTimeLabel() === '第1章 第1天 上午', 'Time label correct');

  // Test 8: getSeason
  const cal9 = new CalendarEngine();
  assert(cal9.getSeason() === '秋', 'Chapter 1 = 秋');

  // Test 9: getState
  const state = cal.getState();
  assert(state.chapter === 1, 'getState returns chapter');
  assert(state.day === 1, 'getState returns day');
  assert(state.energy === 3, 'getState returns energy');

  // Test 10: Constructor from state
  const cal10 = new CalendarEngine({ chapter: 3, day: 5, energy: 2 });
  assert(cal10.chapter === 3, 'Restore chapter from state');
  assert(cal10.day === 5, 'Restore day from state');
  assert(cal10.energy === 2, 'Restore energy from state');

  console.log('\n=== CalendarEngine: ALL 10 TESTS PASSED ===');
}

run();
