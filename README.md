# ✦ 星落之夜 v2.0 — 星辰之约 ✦

一个基于纯前端技术的视觉小说/互动叙事游戏。

## 在线试玩

➡️ [https://chfr19820610-cell.github.io/starfall-v2](https://chfr19820610-cell.github.io/starfall-v2)

## 剧情简介

星落之夜，传说中星辰会坠落人间。你背着行囊，来到了这座叫星落村的小村庄，邂逅三位命运各异的角色——温柔的Lyra、爽朗的Kai、沉静的Selene。你的每一次选择，都将影响他们与你的羁绊，最终导向不同的结局。

## 技术栈

- **零依赖** — 纯 HTML / CSS / JavaScript (ES Modules)
- **零后端** — 完全在浏览器中运行
- **离线可用** — IndexedDB + localStorage 双栈存档
- **响应式** — 适配桌面和移动端

## 特性

- 🎭 多态对话引擎 — 根据关系/条件触发变体对话
- 💞 7维度关系系统 — 好感/信任/默契/舒适/尊重/好奇/紧张
- 📱 手机式应用界面 — 商店/背包/打工/成就/回忆
- 💾 存档系统 — IndexedDB + localStorage 双栈降级
- 🏆 20个成就 + 5个结局 + 3段尾声
- 📅 时间/能量/行动点管理

## 本地运行

直接打开 `src/index.html` 即可游玩，或使用任意 HTTP 服务器托管 `src/` 目录：

```bash
# Python
python -m http.server 8000 -d src/

# Node.js (npx)
npx serve src/
```

## 部署

推送到 `main` 分支后，GitHub Actions 自动部署到 Pages。

## 构建

GitHub Pages 原生部署，无需构建工具。
`src/` 目录即发布目录。
