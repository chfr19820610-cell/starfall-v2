# MainStory Data Spec

## 功能描述
主线剧情数据，80+对话节点，多态变体，多结局系统。

## 数据结构
参见 DialogueEngine spec 中的 dialogueNode 结构。

## 章节规划
- 序章 (ch0): ~10节点, 世界观引入 + 角色初遇
- 第1章 (ch1): ~20节点, 探索星落村 + 结识主要角色
- 第2章 (ch2): ~20节点, 星辰节事件 + 关系深化
- 第3章 (ch3): ~15节点, 冲突升级 + 选择分水岭
- 第4章 (ch4): ~10节点, 真相揭露
- 第5章 (ch5): ~5节点, 结局分支(8种)

## 结局规划
| 结局 | 条件 | 说明 |
|------|------|------|
| end_solitude | 无角色羁绊≥20 | 独自离开 |
| end_lyra | lyra羁绊≥85, flag_chose_lyra | 与Lyra同行 |
| end_kai | kai羁绊≥85, flag_chose_kai | 与Kai同行 |
| end_selene | selene羁绊≥85, flag_chose_selene | 与Selene同行 |
| end_explorer | 收集度≥80% | 探索者结局 |
| end_sacrifice | flag_sacrifice | 牺牲结局 |
| end_stone | flag_found_stone, 任一角色羁绊≥65 | 星辰石结局 |
| end_friendship | 所有角色羁绊≥40且无人≥85 | 友情结局 |

## 验收标准
- [x] 80+节点可顺序遍历
- [x] 每个节点至少1种变体条件
- [x] 8种结局均可解锁
- [x] 分支选择影响后续对话
- [x] 对话数据格式匹配 DialogueEngine 规范

## 代码约束
- 数据与引擎分离
- ≤300行/文件（拆多个文件）
- 中文对话内容
