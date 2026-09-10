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

- dev server 在 http://localhost:5173（常年有一个后台任务跑着，**不要另起一个**）；改完文件 Vite 自己热更新
- 注意 Vite 的开发态转换按秒缓存：同一秒里连改同一个文件两次，可能喂出半新半旧的模块，`touch` 一下强制重转
- 改完样式在浏览器里看不出变化时，**先重启 dev server，再查代码**：旧进程会把改之前编译好的样式一直喂给新开的标签页，硬刷新、换标签都没用（2026-09 那次「窄屏断点没生效」就是这么白查了一轮）
- 反过来，判断「代码对不对」不要靠浏览器里的现象，用产物或真机量：`curl` dev server 的 `src/style.css?direct` 看编译出来的媒体查询，或用 headless Firefox 的 BiDi 口（`--remote-debugging-port`）读元素的计算样式
- 装依赖用 `npm ci --cache /tmp/npm-cache`（沙箱里默认缓存目录只读）
- 产物是自包含的单个 HTML，验线上就是 `curl` 下来比字节数、grep 字样

## 代码约定

- **一个知识只有一个定义**。界面文案集中在 `src/lib/copy.ts`（只收两处以上用到的，值相同不等于同一条知识）；内容长什么样由 `src/lib/outro.ts` 的 `resolveOutro` 一处决定
- 目录表叫 `_registry.ts(x)`：`src/surveys/` 是首页那些入口（全是数据，加一份 = 加一个文件 + 加一行）、`src/steps/` 是向导三步
- 注释写中文，写「为什么这么做」，不写「这行在做什么」
- 不写自定义 CSS：Tailwind v4 + catppuccin 的 `ctp-*` token 够用了
- 入口是根目录的 `index.html`（Vite 的约定，它只是模板，产物是 `dist/index.html`）；里面的 `<title>` 是品牌名唯一一处没走 `COPY.brand` 的地方
- **响应式只有三个模式，只看宽度**（三个数定在 `src/style.css` 的 `@theme`）：窄 `< 30rem`（480px，`max-narrow:`）、中 `30rem–64rem`（就是不加变体的默认样子：页面留白 + 卡片 + 单栏）、大 `≥ 64rem`（`wide:`：分栏 + 右侧清单常驻）。**比例那套（`landscape:` / `portrait:`）已经不用了**——它在「窄而横」的窗口上会误分栏
- 窄屏**边距内化**：容器不再提供横向留白（`max-narrow:px-0`），面横向贴边并去掉侧边描边与圆角（`rounded-none border-x-0`），横向留白由文字 / 控件自己带一次 `px-inset`（`@theme` 的 `--spacing-inset`，全应用只有这 16px 一个数）。裸控件在窄屏不带横向内边距（`BARE_INPUT` 的 `max-narrow:px-0`），否则框一道、控件一道叠成两道。于是整页的文字落在同一条竖线上，窄屏就是一条一维的流
- 最终页（`OutroPage`）不跟这三档：它是拿去截图的作品面，之后单独定规矩
- 判断一律交给 Tailwind 编译成 CSS，不留 JS：没有 `matchMedia`、没有 `ResizeObserver`，代码里也不出现宽度数字
- 用 `grid` 就一定显式写列模板（`grid-cols-1`、`grid-cols-[minmax(0,1fr)_…]`）：不写的话那一列是隐式的 `auto`，按内容 max-content 算、**不会收缩**，输入框天生的固有宽度（400px 出头）会把整列顶出屏幕（2026-09 那次「485px 溢出」就是这么来的）
- 路由用 hash（`#form`、`#outro`、`#<入口 id>`）：构建产物要能直接 `file://` 打开

## 环境

- 技术栈：Vite + Preact + TypeScript（strict）+ Tailwind v4 + `vite-plugin-singlefile`
- 仓库：`omninbs/outro`，公开；线上 https://omninbs.github.io/outro/
- 数据存在浏览器 localStorage（`outro.card.v2`），不经过任何后端
