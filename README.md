# colophon

A tool designed to generate simple video end credits pages.

> This is a project generated entirely by AI

## 用法

- `npm run dev` 开发预览（http://localhost:5173）
- `npm run build` 产出单个自包含的 `dist/index.html`，双击用 `file://` 打开即可
- 向导三步：摘要 → 描述 → 生成。当前页面记在 hash 里（地址出现 `#colophon` 就是最终页），
  刷新与前进后退都能回到原处——也正是因为要支持 `file://`，这里不用路径路由
- 最终页按 F11 全屏后自行截图，工具本身不导出图片

## 结构

- `src/lib/` 数据与纯逻辑
  - `types` 数据结构 · `config` 默认文案与模板 · `card` 条目构造与增删改
  - `colophon` 最终页视图模型（过滤与兜底只在这一处，清单也用它）· `persist` 存档读写与旧版迁移
  - `store` 内容状态 · `router` hash 路由 · `id` 主键
- `src/components/`
  - `ui/` 基础原子（Panel / Field / TextInput / Button / ConfirmButton / Chip / AddButton / IconButton / EmptyHint）
  - `PageShell` 页面外壳 · `WizardShell` 向导骨架 · `ColophonPage` 最终页 · `FilledList` 清单
  - `MetaEditor` / `BlockEditor` 两个列表编辑器 · `Stepper` 步骤条
- `src/steps/` 三个步骤组件 + `registry.tsx` 步骤表（加一步只改这一处）

## 排版约定

- 字号只用 1rem～1.5rem（`text-base` ～ `text-xl`），不引第三方字体
- 不写自定义 CSS，优先 Tailwind 工具类；需要算式就用任意值，如 `max-w-[calc(25vw_+_30rem)]`
- 最终页版面宽度是一条直线 `calc(25vw + 30rem)`：两侧留白随窗口线性变化，不设断点
- 最终页窗口宽 > 高时并排两栏，否则单栏顺读（`landscape:` 变体）
