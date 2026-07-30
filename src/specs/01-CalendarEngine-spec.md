# CalendarEngine Spec

## 功能描述
游戏内日历/日程/能量系统。管理游戏时间（章→天→时段）、行动点（能量）和事件触发调度。

## 数据结构
```javascript
calendarState = {
  chapter: 1,        // 当前章节
  day: 1,            // 当前天 1-15
  period: 0,         // 时段: 0=早, 1=午, 2=晚, 3=夜
  weekday: 1,        // 0=周日, 1=周一...6=周六
  energy: 3,         // 行动点
  totalDaysPlayed: 0 // 总游玩天数
}
```

## 接口签名
```javascript
class CalendarEngine {
  constructor(state?)          // 可选传入存档恢复
  getState()                  // 返回当前状态快照
  advancePeriod()             // 推进一个时段 → {events, newState}
  canAct()                    // energy > 0
  spendEnergy(n)              // 消耗n行动点
  restoreEnergy()             // 跨天重置能量（周末4，工作日3）
  checkTriggeredEvents()      // 检查当前时段是否有事件
  getTimeLabel()              // 返回"第X章 第X天 上午/下午/晚上/深夜"
  getSeason()                 // 基于chapter返回季节
}
```

## 验收标准
- [x] 初始化: chapter=1, day=1, period=0, energy=3(weekday) / 4(weekend)
- [x] advancePeriod: 早→午→晚→夜→(下一天) 循环正确
- [x] 跨天时 energy 自动重置
- [x] 周末(weekday 0或6) energy=4
- [x] canAct 正确反映剩余行动点
- [x] spendEnergy 负数/超量时 clamp
- [x] getTimeLabel 返回中文时间段

## 代码约束
- ≤300行/文件
- 零依赖
- 纯 ES module
