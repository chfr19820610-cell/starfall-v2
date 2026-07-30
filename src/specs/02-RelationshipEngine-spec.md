# RelationshipEngine Spec

## 功能描述
7维关系系统 + 社交图谱。管理主角与NPC间的7维好感度矩阵、关系阶段状态机和NPC间关系。

## 数据结构
```javascript
// PC → NPC 关系 (7维)
pcRelations = {
  'lyra': { affection: 0, trust: 0, chemistry: 0, comfort: 0, respect: 0, curiosity: 0, tension: 0 }
}

// NPC → NPC 关系
npcRelations = {
  'lyra_kai': { type: 'friend'|'rival'|'family', strength: 0-100 }
}

// 关系阶段
stages = ['陌生人','认识','渐暖','亲近','亲密','羁绊']
// 阈值: <10, 10-25, 25-45, 45-65, 65-85, 85+
```

## 接口签名
```javascript
class RelationshipEngine {
  constructor(state?)
  getState()
  getWarmth(charId)            // 正向维平均 - tension*0.2
  getStage(charId)             // warmth → 阶段
  getStageName(charId)         // 中文阶段名
  applyDelta(charId, field, delta)  // 修改关系值(自动clamp 0-100)
  checkThresholds(charId)      // 检测阶段穿越，触发事件
  getPendingEvents()           // 返回未消费的阶段事件
  setNpcRelation(charA, charB, type, strength)
  propagateConsistency(charA, charB, delta)  // 关系一致性传播
  getRelations(charId)        // 获取某角色的所有关系
}
```

## 验收标准
- [x] 新角色默认全维度 0
- [x] applyDelta clamp 到 0-100
- [x] getWarmth 计算正确 (正维平均 - tension*0.2)
- [x] 关系阶段正确映射
- [x] 阶段升级触发 pending event
- [x] 一致性传播: friend_of_friend 提升 0.3x, rival 增紧张 0.2x
- [x] getStageName 返回中文

## 代码约束
- ≤300行/文件
- 零依赖
