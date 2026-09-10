# outro

一个生成「视频结尾信息页」的小工具：答一份问卷或填三页表单，得到一个适合全屏截图当片尾用的页面。内容不限——制作信息、署名、说明、鸣谢、联系方式都行。

> This is a project generated entirely by AI

## 用法

- `npm run dev` 开发预览（http://localhost:5173）
- `npm run build` 产出单个自包含的 `dist/index.html`，双击用 `file://` 打开即可
- 首页列出一份份问卷（第一份是「空预设」）：点进某份问卷答题，答完把这些答案填进内容，
  落到表单的最后一步「生成」，在那儿确认或再改
- 「空预设」就是 `questions` 为空的那份问卷：没有题可答，直接进表单从零填，三步：摘要 → 描述 → 生成
- 当前页面记在 hash 里：空 hash 是首页、`#form` 是表单、`#survey/<id>` 是某份问卷、`#outro` 是结尾页，
  刷新与前进后退都能回到原处——也正是因为要支持 `file://`，这里不用路径路由
- 结尾页按 F11 全屏后自行截图，工具本身不导出图片

## 约定

- 不预设任何文案：模板、声明、默认正文、元数据名称一律没有，初始内容全空，
  元数据条目由使用者在「摘要」步自行添加
- 数据存在 localStorage（`outro.card.v2`），改数据结构就得同时写迁移

## 结构

- 目录里的 `index` 是该目录的清单/入口，和内容文件平级分开：
  `steps/index.tsx` 步骤表 · `surveys/index.ts` 问卷清单 · `components/ui/index.ts` 原子导出
- `src/lib/` 数据与纯逻辑
  - `types` 数据结构 · `config` 初始内容与占位文案 · `layout` 页面容器宽度 · `card` 条目构造与增删改
  - `outro` 结尾页视图模型（过滤与兜底只在这一处，清单也用它）· `persist` 存档读写与旧版迁移
  - `store` 内容状态 · `router` hash 路由 · `id` 主键
  - `survey/` 问卷引擎：`types` 数据形状 · `build` 答案→内容
- `src/surveys/` 各领域问卷的数据：一份问卷一个文件（`blank` / `demo` …），`index.ts` 是清单
- `src/components/`
  - `ui/` 基础原子（Panel / Field / TextInput / TextArea / Button / ConfirmButton / AddButton / IconButton / EmptyHint）
  - `PageShell` 页面外壳 · `HomePage` 首页 · `WizardShell` 向导骨架 · `PageFooter` 页脚 · `OutroPage` 结尾页 · `FilledList` 清单
  - `SurveyPage` 问卷页 · `QuestionInput` 一道题 · `MetaEditor` / `BlockEditor` 两个列表编辑器 · `Stepper` 步骤条
- `src/steps/` 三个步骤组件 + `index.tsx` 步骤表（加一步只改这一处）

## 加一份问卷

问卷是数据不是代码：在 `src/surveys/` 新写一个文件、导出一份 `Survey`，
再到 `src/surveys/index.ts` 的 `SURVEYS` 里加一行，组件一行都不用动。

- `id` 直接进 hash（`#survey/<id>`），用小写 ASCII，别带斜杠
- `questions[].kind`：`text` 单行 · `long` 多行（`rows`，默认 5）· `choice` 单选（配 `options`）
- `questions[].into`：答案落到结尾页哪里——`title` / `footer` / `meta`（左栏一行，配 `label`）/
  `block`（右栏一块，配 `label`）；不写就只给 `build` 用，自己不出现在内容里
- 空白答案整条丢掉：没答的题不会在结尾页留一行空标签
- 要拼接、要算标题，就给这份问卷写 `build(answers)`，覆盖默认搬运（`buildCard`）
- 内容是整份替换的：问卷是从头开始的一条路，答完就覆盖当前内容，然后落在表单的最后一步

## 排版约定

- 字号只用 1rem～1.5rem（`text-base` ～ `text-xl`），不引第三方字体
- 不写自定义 CSS，优先 Tailwind 工具类；需要算式就用任意值，如 `max-w-[calc(25vw_+_30rem)]`
- 结尾页版面宽度是一条直线 `calc(25vw + 30rem)`：两侧留白随窗口线性变化，不设断点
- 结尾页窗口宽 > 高时并排两栏，否则单栏顺读（`landscape:` 变体）
- 分栏一律只看窗口宽高比（`landscape:` 即宽 > 高），不写 `sm:` / `lg:` 这类 px 断点——
  横屏的窄窗口按断点会被误判成单栏，而它其实有横向空间
