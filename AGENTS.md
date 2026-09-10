# outro —— 在这里干活的规矩

结尾页生成器：填几个字段，产出一张可以直接截图的结尾页。给 AI 看的东西都写这一份，改规矩就改这里。

**这份文件跟着现实走**：任何改动只要动了规矩、命令、目录结构或环境事实，就在同一次提交里把它一起改掉。它跟代码对不上，比没有它更糟。

## 怎么干活

- 动手前先用中文把计划说清，一次说完，别拆成一串小确认
- 回答简短：能上表格就上表格；不复述过程，说清结论、改动文件、验证结果就够
- 工具调用能并行的并成一批发出去
- **单条命令不超过 10 秒**。跑不完就拆开跑，或者直接说「这条跑不动」，不要硬试
- 设计取舍拿不准先问，不替人拍板；被否掉的方向不要换个说法再端上来

## 提交

- 每做完一件事提交一次，不攒着
- 信息只有一行：`<type>: <description>`——英文、祈使句、≤50 字符、不带标点
- `type` 取 `feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore`
- **不 push**，除非明确要求。真要 push 时用 `GIT_SSH_COMMAND="ssh -F /dev/null" git push`（本机 ssh 配置有一处权限问题）
- 构建产物不入库：`dist/` 在 `.gitignore` 里；页面由 GitHub Actions 构建，push 到 main 自动发布
- `vite build` 会清空 `dist/`：临时工具别放那儿，放 `.git/` 下（git status 看不见，build 也清不掉）

## 验证

没有 lint，这两个命令就是全部闸门，改完必跑：

```bash
npm run typecheck   # tsc --noEmit
npm run build       # vite build，产出单文件 dist/index.html
```

- dev server 在 http://localhost:5173（`npm run dev`，常年有一个后台任务跑着，**不要另起一个**）；改完文件 Vite 自己热更新
- 注意 Vite 的开发态转换按秒缓存：同一秒里连改同一个文件两次，可能喂出半新半旧的模块，`touch` 一下强制重转。这条真栽过：一次批量改完之后 dev server 一直喂「import 已删、`${MORPH}` 还在」的半成品，浏览器报 `ReferenceError: MORPH is not defined`。判断办法是 `curl -s http://localhost:5173/src/…` 直接看它喂的是什么，`touch` 掉那几个文件再 curl 一遍确认——**别让人去刷新猜**
- 改完样式在浏览器里看不出变化时，**先重启 dev server，再查代码**：旧进程会把改之前编译好的样式一直喂给新开的标签页，硬刷新、换标签都没用（2026-09 那次「窄屏断点没生效」就是这么白查了一轮）。重启还能清掉积坏的 HMR 状态——同一个月里遇到过一次 `#app` 渲染成空、typecheck/build 却全过，重启就好了
- 反过来，判断「代码对不对」不要靠浏览器里的现象：`curl` dev server 的 `src/style.css?direct` 看编译出来的媒体查询；要量真实几何就用 headless Firefox 的 BiDi 口
- **探针**（`.git/` 下，不入库）：`mkdir -p .git/ffprof && firefox --headless --no-remote --profile "$PWD/.git/ffprof" --remote-debugging-port=9222 about:blank`——profile 目录**必须先存在**，不然 Firefox 直接退出报「Could not find profile folder」；放 `.git/` 是因为 `vite build` 会清掉 `dist/`。然后 `node .git/probe-overflow.mjs 485 481`（找横向溢出的元素）、`probe-motion.mjs`（跨断点采样 padding，几何量应当是直接跳的）或 `probe-outro.mjs`（最终页版面：量宽度上限 / 居中 / 分栏条件 / 有没有溢出，自带一份种进 localStorage 的存档，种完要**重新加载**才生效）——探针都打 `dist/index.html`，免得吃 dev server 的旧模块。Firefox 只允许**一个** BiDi 会话，所以一个脚本里把要量的宽度 / 路由循环完，别一个宽度起一次（一个脚本跑完就 `ws.close()`，否则下一次会报「Maximum number of active sessions」，那就得重启 Firefox）
- 量响应式时记住：**Firefox 的媒体查询宽度把滚动条算进去**，排版区不算（窗口 485 → 媒体查询按 485 判，`clientWidth` 只有 473）
- 沙箱里 `ss` 看得到端口、却看不到别人的 PID：**杀不掉你终端里那个 dev server**，要重启得请你来
- 杀进程别用 `pkill -f '关键词'`——模式会匹配到自己那条命令行，整条命令被杀（退出码 143）。用 `firefox … & ffpid=$!` 存 PID，或 `pkill -x 名字`
- 比字节用 `wc -c`：`$(...)` 会吃掉末尾换行（差 1 字节），JS 的 `.length` 是字符数不是字节数
- 装依赖用 `npm ci --cache /tmp/npm-cache`（沙箱里默认缓存目录只读）
- 产物是自包含的单个 HTML，验线上就是 `curl` 下来比字节数、grep 字样

## 代码约定

- **一个知识只有一个定义**：界面文案集中在 `src/lib/copy.ts`（只收两处以上用到的，值相同不等于同一条知识）；内容长什么样由 `src/lib/outro.ts` 的 `resolveOutro` 一处决定；框的外观是 `ui/inputs.tsx` 的 `BOX` / `BARE_INPUT` / `BareRow`；排版与动效片段在 `ui/tokens.ts`
- 目录表叫 `_registry.ts(x)`：`src/surveys/` 是首页那些入口（全是数据，加一份 = 加一个文件 + 加一行）、`src/steps/` 是向导三步
- 问卷是数据不是代码：题目写 `into` 决定答案落到结尾页哪里（`meta` / `block` / `title` / `footer`），需要加工才写 `build`；加一份问卷不用碰组件
- 注释写中文，写「为什么这么做」，不写「这行在做什么」
- 不写自定义 CSS：Tailwind v4 + catppuccin 的 `ctp-*` token 够用。唯一的例外是 `style.css` 里那条 `.safe-area`——它要读 `env(safe-area-inset-*)`，没有别的写法
- Tailwind 的扫描来源写死在 `style.css` 头上（`@import "tailwindcss" source(none)` + `@source "../src"` + `@source "../index.html"`）：默认它扫**整个仓库**，于是 `AGENTS.md` 里的中文散文（写着 `` `transition` ``、`` `rounded-none` `` 这种词）会被当成类名、真编译成规则——2026-09 实测产物里躺着 `.transition`、`.rounded-none`、`.contents`、`container` 这些没人用的死代码，删掉省了 700 来字节。以后加新目录（比如 `tools/`）要在这儿补一行 `@source`
- 入口是根目录的 `index.html`（Vite 的约定，它只是模板，产物是 `dist/index.html`）；里面的 `<title>` 是品牌名唯一一处没走 `COPY.brand` 的地方
- 路由用 hash（`#form`、`#outro`、`#<入口 id>`）：构建产物要能直接 `file://` 打开

## 响应式

- **只有三个模式，只看宽度**（三个数定在 `src/style.css` 的 `@theme`；判断交给 Tailwind 编译成 CSS，代码里不出现宽度数字，也没有 `matchMedia` / `ResizeObserver`）：窄 `< 30rem`（480px，`max-narrow:`）、中 `30rem–64rem`（不加变体的默认样子：页面留白 + 卡片 + 单栏）、大 `≥ 64rem`（`wide:`：分栏 + 右侧清单常驻）
- **比例那套（`landscape:` / `portrait:`）已经彻底退役**（2026-09 连最终页也换掉了，代码里再出现就是走回头路）；容器查询（`@container` / `@max-sm`）只在元数据那行试过一轮也收掉了——一个页面里并存两套判断迟早长歪。要加响应式行为，先问「它属于窄 / 中 / 大哪一档」
- 窄屏是**一维的流**（边距内化）：容器不再提供横向留白（`max-narrow:px-0`），面横向贴边并去掉侧边描边与圆角（`rounded-none border-x-0`），横向留白由文字 / 控件自己带一次 `px-inset`（`@theme` 的 `--spacing-inset`，全应用只有这 16px 一个数）。裸控件在窄屏不带横向内边距（`BARE_INPUT` 的 `max-narrow:px-0`），否则框一道、控件一道叠成两道
- 推论：**贴边的面没法再给内容留边**，所以卡片里凡是裸文字 / 裸列表都得自己写 `max-narrow:px-inset`（`Field` 的标签、`FilledList` 的内容、首页卡片的说明、`GenerateStep` 的正文都是这么办的）
- 元数据行（`MetaEditor`）窄屏上下排——它算窄模式的一种样式变体，不按自己的容器宽度单独判
- 用 `grid` 就一定显式写列模板（`grid-cols-1`、`grid-cols-[minmax(0,1fr)_…]`）：不写的话那一列是隐式的 `auto`，按内容 max-content 算、**不会收缩**，输入框天生的固有宽度（400px 出头）会把整列顶出屏幕（2026-09 那次「485px 溢出」就是这么来的）
- **动效**只有渐变：`ui/tokens.ts` 的 `FADE` / `RISE` / `HOVER` 都长在同一份清单上（`opacity` / 文字色 / 底色 / 描边色 / `display`），别在组件里散着写 `transition-*`——一个元素只能有一份 `transition-property`，所以清单只在那个文件里写一次。基调 150ms / ease-out / 不回弹（目标是「别硬蹦」不是「炫」），`motion-reduce` 下完全不动；`flex-direction`、列数变化这类插不了值的只能用 `FADE` 淡一下遮住
- **几何量一概不插值**：内边距 / 描边宽度 / 圆角 / 位移 / 缩放都不在清单里——按下不缩放，跨窄屏线时零件不收放，形状变化直接跳。理由是插值出来的是「在动」，页面里一有东西在动，观者就得跟着重新找位置；2026-09 为此收掉两轮（选项按钮按下缩 2%、整页跨窄屏线一起收放），**别再加回来**。反馈一律靠颜色
- **跨档不做任何动画，连整体淡一下都不要**：试过用 `animation` 让整页在换档时淡进来（机制：媒体查询不会重播 `transition`，只有 `animation-name` 变化才重播，所以三个档得配三个名字），结果看起来不是「两个状态在换」而是「整页消失又重现」，比硬跳更差，已收掉。跨档想让人看得见，只能靠颜色或内容本身的变化
- 悬停的反馈是**元素自己**变色，不位移也不换形状；贴在框里的图标按钮（×）连淡底都不给——浮出一块底色看着像框里又长出一个按钮
- **最终页（`OutroPage`）也跟这三档**，只是它是「拿去截图的那一屏」，有三处自己的排版细节：① 版面只有一个宽度数 `max-w-[48rem]`（比向导容器窄一档，行更短、更像一张版面）；② 整块**横竖都居中**（`justify-center-safe`，内容比屏幕高时退回顶部排，不会被切掉上半截）；③ 纵向那个「重心上移 28px」的光学补偿用**内边距**拿（`pb-26`，窄屏 `pb-22`：下面比上面多 56px），不用 `translate`——translate 在内容比屏幕高时会让标题只剩 4px 边距（探针量到过）。它身上没有「面」（无卡片 / 底色 / 描边），所以窄屏的边距内化落到这里就是 `px-6` 收到 `max-narrow:px-inset` 这一条；`wide:` 才分两栏（左元数据 1.2 : 右文本块 1）

## 内容与文案

- 类别名写全，不缩写（「逻辑红石音乐」不写成「逻辑红乐」）——标题、地址、首页卡片一律全称
- 选项表是常用值不是全集：长一点的单选都要留「自定义」的口子，自己写的那一句也要能进结尾页
- × 要**看起来**嵌在框里：靠组合拿到（`BareRow` 多传一个 `action`），不是塞进 `<input>` 里
- 预填值（`default`）与占位提示（`placeholder`）是两件事：前者是真答了、会印到结尾页；后者只是灰字。「不填就不显示」用不写 `default` + 占位写「不显示」表达
- 空答案整条丢掉：没填的题不在结尾页留一个空标签

## 环境

- 技术栈：Vite + Preact + TypeScript（strict）+ Tailwind v4 + `vite-plugin-singlefile`
- 仓库：`omninbs/outro`，公开；线上 https://omninbs.github.io/outro/
- 数据存在浏览器 localStorage（`outro.card.v2`；旧键 `colophon.card.*` 会被迁移过来），不经过任何后端
- 发布：`.github/workflows/deploy.yml`，push 到 main 自动跑（node 22 + configure-pages@v6 / upload-pages-artifact@v5 / deploy-pages@v5）。注意 `concurrency: pages` 且 `cancel-in-progress: false`——**卡住的 run 会挡住后面的**，得去 Actions 页面把它取消
- 要发一份给别人：`cp dist/index.html dist/outro.html`，自包含、`file://` 直接打开，对方的数据只存在他自己浏览器里
