# SaveSystem Spec

## 功能描述
存档/读档系统，IndexedDB主存储 + localStorage降级。

## 数据结构
```javascript
saveData = {
  version: 2,
  timestamp: Date.now(),
  calendar: { chapter, day, period, energy, totalDaysPlayed },
  flags: {},
  relationships: {},
  npcRelations: {},
  memories: [],
  achievements: {},
  inventory: { currency: 0, items: [], equipped: null },
  endings: [],
  stats: { dialoguesRead: 0, choicesMade: 0, totalPlayTime: 0, relationshipsFormed: 0 }
}
```

## 接口签名
```javascript
class SaveSystem {
  constructor(dbName?)
  save(saveData)                   // 写存档
  load()                           // 读存档
  autoSave(saveData)               // 自动存档
  loadAutoSave()                   // 读自动存档
  hasSave()                        // 是否有存档
  deleteSave()                     // 删除存档
  detectStorage()                  // 检测可用存储(IndexedDB > localStorage)
  migrateV1(data)                  // v1→v2迁移
  exportSave()                     // 导出为JSON
  importSave(json)                 // 从JSON导入
}
```

## 验收标准
- [x] IndexedDB 读写正常
- [x] IndexedDB 不可用时自动降级到 localStorage
- [x] 存档包含 version 字段
- [x] 自动存档在关键节点触发
- [x] 读档后所有状态完整恢复
- [x] v1→v2 迁移正确
- [x] hasSave 正确判断

## 代码约束
- ≤300行/文件
- 零依赖
