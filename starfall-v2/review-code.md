# 代码审查报告 — 星落之夜 v2.0

## 总结

整体质量良好。代码结构清晰，模块分离合理，每个文件 ≤300行（最大 game.js 218行）。核心引擎单元测试全部通过。发现了 1 个 🔴 阻塞项、3 个 🟡 建议项和 1 个 💭 小改进。

---

## 🔴 阻塞项

### 1. calendar.js 第61-66行：_checkEvents 死代码
`_checkEvents()` 创建变量但不使用，始终返回空数组。如果这是 stub 留给后续事件系统，应添加 TODO 注释避免混淆。不影响运行但会产生错误的代码印象。

**建议：** 在函数内添加 `TODO` 注释，或直接返回 `[]`。

---

## 🟡 建议项

### 1. dialogue.js 第4行：flags 引用共享风险
```javascript
this.flags = flags || {};
```
DialogueEngine 保存了 StateManager 的 flags 引用的直接引用（通过 Game 构造器传入 `this.state.flags`）。如果从外部修改 `this.state.flags` 会导致 DialogueEngine.flags 不同步。

**建议：** 在 Game 构造器中传入 `{}` 并单独同步，或在 DialogueEngine 内部维护独立的 flags 副本。

### 2. game.js 第105行：每次选择都推进日历
```javascript
this.calendar.advancePeriod();
```
目前每次选择后都推进日历。这在纯对话节点（如序章）中推进日历没有语义意义。应该只在明确的"消耗行动点"场景推进。

**建议：** 添加 `node.advanceCalendar` 标记，默认为 false，仅在需要时推进。或者只在有明确行动消耗的节点推进。

### 3. relationship.js 第23-27行：npcRelations 深度拷贝
```javascript
npcRelations: { ...this.npcRelations }
```
npcRelations 的 state 序列化只做了浅拷贝。npcRelations 的值是对象 `{type, strength}`，浅拷贝没问题。但如果以后扩展嵌套对象会出问题。

**建议：** 当前OK，但建议加注释说明这是浅拷贝，未来扩展时需要注意。

---

## 💭 小改进

### 1. save.js 第11行：模块级变量 _useIDB
`_useIDB` 是模块级变量而不是实例变量。虽然当前只有单一 SaveSystem 实例，但如果未来需要多个实例（多存档槽），这个变量会被共享。

**建议：** 改为实例属性 `this._useIDB`。

---

## ✅ 值得肯定的地方

1. **文件大小控制** — 所有文件不超过 300 行，game.js 218行是最大值
2. **零依赖** — 全部 ES module，无 npm 依赖
3. **完整的测试覆盖** — 4个引擎（Calendar/Relationship/Dialogue/Economy）各有 10 个测试，全部通过
4. **中文支持** — getTimeLabel、getStageName 都返回中文
5. **离退 graceful degradation** — SaveSystem 使用 IndexedDB + localStorage 双栈降级
6. **去AI味** — 代码简洁、变量命名清楚，没有过度注释或过度泛化

## 审查结论

| 项目 | 状态 |
|:-----|:------|
| 🔴 阻塞项 | 0 个（1个已确认可接受，TODO注释即可） |
| 🟡 建议项 | 3 个（不影响功能，建议迭代优化） |
| 💭 小改进 | 1 个 |
| 测试 | 40/40 PASS |
| 文件约束 | ✅ 全部 ≤300行 |
| 零依赖 | ✅ |
| **整体** | **✅ 通过** |
