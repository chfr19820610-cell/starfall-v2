# 星落之夜 v2.0 — 升级方案

> 产品部 · 产品战略师 · v2.0 升级规划
> 设计原则：保留零安装、纯前端优势，补"留人"短板

---

## 一、设计哲学

### 核心原则
1. **零后端优先** — 所有功能要么纯前端实现，要么用无服务端方案
2. **内容深度 > 内容量** — 不堆量，每个场景/角色/事件有后续影响
3. **重玩性 = 变量多样性 × 事件组合数** — 同样的选择，不同的上下文产生不同的结果
4. **渐进式复杂度** — 新手 10 分钟可通关，核心玩家可玩 10 小时

### 与 Heartmorrow 的差异化定位

| 维度 | Heartmorrow | 星落之夜 v2 |
|:-----|:------------|:------------|
| 部署 | 本地服务器 | GitHub Pages 即开即玩 |
| LLM | 必需 | 可选（降级为预写内容） |
| 复杂度 | 极复杂 | 极简但深度 |
| 目标用户 | 技术玩家 | 轻量故事玩家 |
| 内容 | 用户自建世界 | 精美预制故事世界 |

## 二、功能架构全景

```
星落之夜 v2.0
├── 核心叙事层
│   ├── 分支剧情引擎（升级）
│   ├── 多结局系统
│   └── 回溯/章节选择
│
├── 日历系统★（新增）
│   ├── 时间推进引擎
│   ├── 事件触发调度
│   └── 日程管理（精力经济）
│
├── 深度关系系统★（新增）
│   ├── 7维好感度矩阵
│   ├── 关系阶段状态机（6阶段）
│   ├── 角色间关系图谱
│   └── 动态事件触发
│
├── 记忆与收集系统★（新增）
│   ├── 回忆相册
│   ├── 成就/勋章墙
│   ├── 剧情树回看
│   └── 统计面板
│
├── 小游戏系统★（新增）
│   ├── 占星配对
│   ├── 星辰记忆
│   └── 符文谜题
│
├── 经济系统（轻量）
│   ├── 星辉货币
│   ├── 商店/礼物
│   └── 工作/探索赚取
│
└── 内容扩展层
    ├── AI辅助内容生成（可选）
    └── 故事编辑器（v2.5）
```

## 三、核心系统详细设计

### 3.1 日历与日程系统

```
CalendarEngine
├── 游戏内时间: 章 → 天 → 时段(早/午/晚/夜)
├── 每章固定15天
├── 每天3个行动点（周末4个）
├── 行动: 对话/探索/小游戏/休息/收集
└── 时段推进触发事件检查
```

**技术方案：**
```javascript
class CalendarEngine {
  constructor() {
    this.chapter = 1;
    this.day = 1;       // 1-15
    this.period = 0;    // 0=早, 1=午, 2=晚, 3=夜
    this.weekday = 1;   // 0=周日, 1=周一... 6=周六
    this.energy = 3;    // 周一默认3点（非周末），advancePeriod按当日重算
    this.totalDays = 0;
    this.events = [];
  }
  
  advancePeriod() {
    // 推进时段
    if (this.period < 3) {
      this.period++;
    } else {
      this.period = 0;
      this.day++;
      this.weekday = (this.weekday + 1) % 7;
      this.totalDays++;
      this.energy = (this.weekday === 0 || this.weekday === 6) ? 4 : 3; // 周末4行动点
    }
    // 检查该时段是否有预定义事件
    return this.checkTriggeredEvents();
  }
  
  checkTriggeredEvents() {
    // TODO: 基于 day + weekday + flags + relationships 检查触发条件
    // 返回匹配的事件列表
    return [];
  }
}
```

**数据存储：** IndexedDB 序列化 calendarState（通过 lib/idb.js 封装）

### 3.2 深度关系系统

```
RelationshipEngine
├── 7维矩阵（每个角色对主角）
│   ├── 好感 (0-100)
│   ├── 信任 (0-100)
│   ├── 默契 (0-100)
│   ├── 舒适 (0-100)
│   ├── 尊重 (0-100)
│   ├── 好奇 (0-100)
│   └── 紧张 (0-100)
│
├── 关系阶段（基于温暖度）
│   0 → 陌生人 (<10)
│   1 → 认识 (10-25)
│   2 → 渐暖 (25-45)
│   3 → 亲近 (45-65)
│   4 → 亲密 (65-85)
│   5 → 羁绊 (85+)
│
├── 角色间关系图谱
│   JSON邻接表存角色之间关系
│
└── 事件触发规则
    温暖度穿越阈值 → 触发特殊剧情
    特定flag组合 → 解锁隐藏事件
```

**技术方案：**
```javascript
class RelationshipEngine {
  constructor() {
    // 主角 → 角色关系
    this.pcRelations = {}; // {charId: {affection, trust, chemistry, comfort, respect, curiosity, tension}}
    // 角色间关系
    this.npcRelations = {}; // {charId_otherId: {type: 'friend'|'rival'|'family', strength: 0-100}}
    // 上次关系阶段快照（用于检测阈值穿越）
    this._lastStage = {};
  }
  
  getWarmth(charId) {
    const rel = this.pcRelations[charId];
    if (!rel) return 0;
    // 5个正向维度平均 - 紧张度负因子
    const positive = (rel.affection + rel.trust + rel.chemistry + rel.comfort + rel.respect) / 5;
    const tensionPenalty = rel.tension * 0.2;
    return Math.max(0, positive - tensionPenalty);
  }
  
  getStage(charId) {
    const w = this.getWarmth(charId);
    if (w < 10) return 0;  // 陌生人
    if (w < 25) return 1;  // 认识
    if (w < 45) return 2;  // 渐暖
    if (w < 65) return 3;  // 亲近
    if (w < 85) return 4;  // 亲密
    return 5;               // 羁绊
  }
  
  applyDelta(charId, field, delta) {
    // 为新角色初始化默认关系（陌生人起点）
    if (!this.pcRelations[charId]) {
      this.pcRelations[charId] = {affection: 0, trust: 0, chemistry: 0, comfort: 0, respect: 0, curiosity: 0, tension: 0};
    }
    // 所有修改clamp到0-100
    const current = this.pcRelations[charId][field] ?? 0;
    this.pcRelations[charId][field] = Math.max(0, Math.min(100, current + delta));
    this.checkThresholds(charId);
  }
  
  checkThresholds(charId) {
    const oldStage = this._lastStage[charId] ?? 0;
    const newStage = this.getStage(charId);
    if (newStage !== oldStage) {
      this._lastStage[charId] = newStage;
      if (newStage > oldStage) {
        this._pendingEvents.push({type: 'stage_up', charId, stage: newStage});
      }
    }
  }
  
  // 关系一致性传播：当A对B的好感变化时，影响A的朋友/对手对B的态度
  propagateConsistency(charA, charB, delta) {
    // 遍历所有与charA有关系的NPC
    for (const [key, rel] of Object.entries(this.npcRelations)) {
      const [a, b] = key.split('_');
      const thirdParty = (a === charA) ? b : (b === charA) ? a : null;
      if (!thirdParty || thirdParty === charB) continue;
      
      const isFriend = rel.type === 'friend' && rel.strength > 40;
      const isRival = rel.type === 'rival';
      
      if (delta > 0 && isFriend) {
        // 朋友的朋友是朋友：正向delta * 0.3 传播
        this.applyDelta(thirdParty, 'affection', Math.round(delta * 0.3));
      } else if (delta > 0 && isRival) {
        // 对手的朋友是敌人：正向delta * -0.2 传播
        this.applyDelta(thirdParty, 'tension', Math.round(Math.abs(delta) * 0.2));
      }
    }
  }
}
```

### 3.3 多态剧情引擎

用预写 + 条件组合代替 LLM 实时生成：

```javascript
class DialogueEngine {
  constructor(relationshipEngine) {
    this.relEngine = relationshipEngine;
  }
  
  // 每条对话增加条件检查
  getDialogue(id) {
    const d = DIALOGUES[id];
    if (!d) return null;
    // 检查变体条件
    if (d.variants) {
      for (const v of d.variants) {
        if (this.checkConditions(v.conditions)) {
          return {...d, text: v.text, choices: v.choices};
        }
      }
    }
    return d;
  }
  
  checkConditions(conds) {
    // conds示例: {affection_lyra: {min: 60}, flags: ['choose_stone']}
    // affection_lyra → 角色lyra的好感度 ≥ 60
    // 返回是否满足所有条件
    for (const [key, rule] of Object.entries(conds)) {
      if (key === 'flags') {
        // 检查flag：所有列出的flag必须为true
        for (const f of rule) {
          if (!GameState.flags[f]) return false;
        }
        continue;
      }
      // 解析 field_charId 格式（如 affection_lyra, trust_kai）
      const match = key.match(/^(\w+)_(\w+)$/);
      if (match) {
        const [_, field, charId] = match;
        const warmth = this.relEngine.pcRelations[charId]?.[field] ?? 0;
        for (const [op, val] of Object.entries(rule)) {
          if (op === 'min' && warmth < val) return false;
          if (op === 'max' && warmth > val) return false;
        }
      }
    }
    return true;
  }
  
  // 应用对话效果到关系系统
  applyEffects(effects) {
    if (!effects) return;
    for (const [key, delta] of Object.entries(effects)) {
      const match = key.match(/^(\w+)_(\w+)$/);
      if (match) {
        const [_, field, charId] = match;
        this.relEngine.applyDelta(charId, field, delta);
      }
    }
  }
}
```

每条对话数据增加：
```javascript
{
  speaker: 'lyra',
  text: '你来了。我就知道你会来。',
  scene: 'tree',
  // 新增：条件变体
  variants: [
    {
      conditions: {affection_lyra: {min: 60}, flags: ['talk_lyra']},
      text: '你来了。我一直在等你。今晚的星星很亮——就像你的眼睛。'
    },
    {
      conditions: {affection_lyra: {max: 20}},
      text: '呃。又是你。我只是路过。'
    }
  ],
  // 新增：关系影响
  effects: {affection_lyra: 2, trust_lyra: 1},
  next: 'ch1_007'
}
```

**变异率控制：** 每个对话节点至少 2-3 种条件变体文本，覆盖低/中/高好感度状态。实际多样性 = 变体数 × 场景数 × 分支选择数，远大于预写总数。

### 3.4 小游戏系统

| 小游戏 | 主题 | 技术实现 | 收益 |
|:-------|:-----|:---------|:-----|
| 星辰记忆 | 配对卡牌 | CSS + JS 翻转动画 | 好感+星辉 |
| 占星连线 | 星座匹配 | Canvas 拖拽 | 好感+线索 |
| 符文谜题 | 逻辑拼图 | CSS Grid + 拖拽 | 信任+星辉 |
| 命运之签 | 抽签占卜 | 纯随机+文本 | 运气buff |

### 3.5 记忆与收集系统

```
CollectionSystem
├── 回忆相册
│   ├── 关键剧情节点自动收录
│   ├── 每段回忆含：场景名、时间、角色、一句话
│   └── 画廊浏览
│
├── 成就系统
│   ├── ~20 个成就
│   ├── 分铜/银/金/星辉4档
│   └── 解锁条件持久化
│
├── 剧情树
│   └── 可视化已走/未走分支
│
└── 结局画廊
    └── 已解锁结局陈列
```

## 四、数据架构

```javascript
// 存档数据结构 v2
const SAVE_V2 = {
  version: 2,
  calendar: {
    chapter: 1, day: 1, period: 0, energy: 3,
    totalDaysPlayed: 0
  },
  flags: {},           // v1 兼容
  relationships: {},   // 7维矩阵
  npcRelations: {},    // 角色间关系
  memories: [{
    id: 'mem_001',
    title: '村口初遇',
    charId: 'lyra',
    warmth: 35,
    scene: 'square',
    chapter: 1, day: 1,
    unlocked: true
  }],
  achievements: {
    'ach_stone': {unlocked: true, time: Date.now()},
    'ach_lyra_trust': {unlocked: false}
  },
  inventory: {
    currency: 0,       // 星辉
    gifts: [],          // 物品id数组
    equipped: null      // 装饰品
  },
  endings: ['end_normal', 'end_stone'],
  stats: {
    dialoguesRead: 142,
    choicesMade: 23,
    totalPlayTime: 3600, // 秒
    relationshipsFormed: 3
  }
};
```

## 五、技术路线

### 保留的 v1 优势
- ✅ 单 HTML 文件（可拆分 JS/CSS，但仍零构建）
- ✅ 纯前端 localStorage
- ✅ GitHub Pages 部署
- ✅ 离线可运行
- ✅ 响应式移动端适配

### 新增技术方案
| 系统 | 方案 |
|:-----|:-----|
| 状态管理 | 单例 GameState 对象 + EventBus，取代全局变量 |
| 事件系统 | 发布-订阅 EventBus |
| UI 框架 | 纯 JS 模板渲染（SFC 模式，无框架） |
| CSS 尺寸 | 预计膨胀到 ~80KB（含小游戏） |
| 性能 | 所有数据 < 1MB，无性能担忧 |

### 文件结构（拆分为 5 个 JS 模块，运行时动态加载）
```
index.html              (~5KB 启动器)
styles.css              (~15KB)
js/
  engine-core.js        (~8KB)  事件循环、存档、日历
  engine-dialogue.js    (~15KB) 对话引擎、变体匹配
  engine-relationships.js (~10KB) 关系系统
  ui-renderer.js        (~12KB) UI渲染器
  data-scenes.js        (~20KB) 剧情数据（v2多态版本）
  data-achievements.js  (~2KB)  成就定义
  minigames.js          (~15KB) 小游戏
```

## 六、预期效果

| 指标 | v1.0 | v2.0 目标 |
|:-----|:-----|:----------|
| 首次通关时长 | ~10分钟 | ~2小时 |
| 全内容解锁 | ~20分钟 | ~10-15小时 |
| 分支数 | ~4个选择点 | ~30+选择点 |
| 可解锁结局 | 2个变体 | 8+个独立结局 |
| 角色关系深度 | 3维好感 | 7维+6阶段 |
| 重玩支撑 | 无 | 成就+结局画廊+多路线 |
| 留存机制 | 无 | 每日星签+事件+收集 |

## 七、不做的功能（与 Heartmorrow 刻意区分）

- ❌ 本地 LLM 集成 — 门槛太高，与零安装矛盾。（LLM 沙盒模式移至 v2.x 路线图）
- ❌ 角色编辑器 — 内置编辑器移至 v2.x，v2 聚焦内容深度
- ❌ 多世界 — 聚焦星落之夜这一个世界
- ❌ 社交网络 — 用预写动态事件代替实时社交
- ❌ 在线多人 — 纯单人体验

### v2.x 路线图（本次不做）

| 功能 | 目标版本 | 前置条件 |
|:-----|:---------|:---------|
| LLM 沙盒模式（可选 API/Ollama） | v2.1 | v2.0 自由模式数据验证通过 |
| 内容编辑器（角色/场景/对话） | v2.2 | 社区反馈需求确认 |
| 多语言（英文） | v2.3 | 主线内容稳定 |
| WebLLM 浏览器内推理 | v2.5 | WebGPU 生态成熟 |
