# UI Framework Spec

## 功能描述
全局UI框架：事件总线、状态管理器、对话渲染、HUD、手机界面、日历视图。

## 数据结构
```javascript
// EventBus
events = {
  'dialogue:show': [cb1, cb2],
  'rel:update': [cb],
  'cal:advance': [cb],
  'save:autosave': [cb],
  'ach:unlock': [cb],
  'scene:change': [cb]
}
```

## 接口签名
```javascript
class EventBus {
  on(event, cb)           // 订阅
  off(event, cb)          // 取消订阅
  emit(event, data)       // 触发
  once(event, cb)         // 单次订阅
}

class StateManager {
  constructor(saveSystem)
  getState()
  setFlag(key, value)
  getFlag(key)
  save()                  // 触发自动存档
  load()                  // 读档恢复
  reset()                 // 重置游戏
}

class DialogRenderer {
  constructor(containerEl, eventBus)
  showDialogue(node, speakerName)     // 渲染对话
  showChoices(choices)                // 渲染选项
  hide()                              // 隐藏对话
  setTypeSpeed(ms)                    // 打字机速度
  skipAnimation()                     // 跳过打字动画
}

class HUD {
  constructor(containerEl, eventBus, relEngine)
  update()                            // 刷新HUD
  showRelationship(charId)            // 显示关系面板
  showCalendar(calState)              // 显示日历
  showEnergy(energy)                  // 显示行动点
  showCurrency(amount)                // 显示星辉
}
```

## 验收标准
- [x] EventBus 发布/订阅/取消正常
- [x] StateManager 状态统一管理
- [x] DialogRenderer 打字机效果
- [x] HUD 实时更新关系/日历/能量/货币
- [x] 组件间通过 EventBus 通信
- [x] 移动端触摸适配
- [x] 暗色主题 CSS 变量

## 代码约束
- ≤300行/文件, 每个组件独立文件
- CSS Variables 主题支持
