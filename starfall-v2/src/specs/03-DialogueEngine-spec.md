# DialogueEngine Spec

## 功能描述
多态对话引擎，支持条件变体匹配。根据好感/flag自动选择对话文本，并应用关系影响。

## 数据结构
```javascript
dialogueNode = {
  id: 'ch1_001',
  speaker: 'lyra',
  text: '默认文本',
  scene: 'tree',
  variants: [{
    conditions: { affection_lyra: {min: 60}, flags: ['talk_lyra'] },
    text: '变体文本',
    choices: [{ text: '选项', effects: {affection_lyra: 2}, next: 'ch1_002' }]
  }],
  effects: { affection_lyra: 1, trust_lyra: 1 },
  choices: [{ text: '默认选项', next: 'ch1_002' }],
  next: 'ch1_002'
}
```

## 接口签名
```javascript
class DialogueEngine {
  constructor(relEngine, flags)
  getDialogue(id)                    // 获取对话(含变体匹配)
  checkConditions(conds)             // 条件检查引擎
  applyEffects(effects)              // 应用关系影响
  getChoices(id)                     // 获取可用选项
  getSpeaker(id)                     // 获取说话者信息
  getNextDialogue(choiceIndex, id)   // 选择后获取下一对话
}
```

## 验收标准
- [x] 条件满足时返回变体文本
- [x] 条件不满足时返回默认文本
- [x] 多条件组合(好感+flag)正确
- [x] applyEffects 正确修改关系
- [x] 数据损坏时返回默认(不崩溃)
- [x] 选项有关系影响时正确应用
- [x] 不存在的 id 返回 null

## 代码约束
- ≤300行/文件
- 零依赖
