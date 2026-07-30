# Store/Inventory/Economy Spec

## 功能描述
星辉经济系统：工作赚取、商店购买、背包管理、赠送礼物。

## 数据结构
```javascript
inventory = {
  currency: 0,       // 星辉
  items: [],         // {id, name, type, icon, desc}
  equipped: null     // 当前装备
}

storeItem = {
  id: 'gift_flower',
  name: '星辰花',
  type: 'gift'|'food'|'deco',
  price: 50,
  effect: { affection: 5 },
  icon: '🌸'
}

job = {
  id: 'job_farm',
  name: '农场帮忙',
  reward: 30,
  energyCost: 2,
  minigame: null
}
```

## 接口签名
```javascript
class EconomySystem {
  constructor(state?)
  getState()
  getBalance()                     // 星辉余额
  earn(amount)                     // 赚取星辉
  spend(amount)                    // 消费星辉
  canAfford(amount)                // 是否买得起
  addItem(item)                    // 加入背包
  removeItem(itemId)               // 移除物品
  useGift(itemId, charId, relEngine) // 送礼→好感变化
  equip(itemId)                    // 装备装饰品
  getItemsByType(type)             // 按类型筛选
}
```

## 验收标准
- [x] 余额正确加减
- [x] canAfford 正确
- [x] 负数余额 clamp 到 0
- [x] 背包物品 CRUD
- [x] 送礼正确修改好感
- [x] 装备/卸下装饰品
- [x] 物品数据完整性检查

## 代码约束
- ≤300行/文件
- 零依赖
