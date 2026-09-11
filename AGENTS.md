# outro —— 在这里干活的规矩

结尾页生成器：填字段，产出可直接截图的结尾页。这是给 AI 的唯一一份规矩；动了规矩、命令、目录或环境事实，同一次提交一起改。

## 怎么干活

- 用中文一次说清计划再动手；回答只给结论、改动文件、验证结果
- 工具调用能并行就并成一批；省 token：对账性测试、探针、线上核对不跑，命令能合并就合并；单条 ≤10 秒
- 改完跑闸门（见「验证」）就提交；取舍拿不准先问，被否的方向不换说法再来

## 提交

- 一件事提交一次；一行 `<type>: <description>`（英文、≤50 字符、无标点；type 取 feat / fix / docs / style / refactor / test / chore）
- 不 push，除非明确要求（要 push 加 `GIT_SSH_COMMAND="ssh -F /dev/null"`，之后不验线上）；`dist/` 不入库，临时工具放 `.git/`

## 验证

没有 lint，闸门三条（合成一条跑）：

```bash
npm run typecheck && npm test && npm run build
```

- 单测只碰**纯函数**（`tests/`）：数据搬运、存档迁移、内容过滤。界面与样式不测——那两样靠人看，写不出比看更准的断言
- dev server 在 http://localhost:5173，常有后台任务不要另起；转换按秒缓存，改完同一文件 `touch` 后 `curl` 比特征串（逐个模块比），样式看不出变化先重启它
- 探针只在读代码判断不了时用：脚本在 `.git/`，一轮量完、用完关 Firefox；profile 先建、单 BiDi 会话、端口占用换 `PROBE_PORT`；真实几何用 headless BiDi
- Chromium 那一路探针同源、更好写：探针页把结果写进 `<pre>`，用 `chromium --headless --no-sandbox --user-data-dir=$PWD/.git/probe-profile --virtual-time-budget=15000 --dump-dom <url>` 把 DOM 取回来；不给 `--user-data-dir` 它写不了默认的 profile 目录，会直接不启动
- 别人的 dev server 杀不掉请用户重启；自己起的换掉先 `job_kill`；杀进程用 `pkill -x` 或存 PID；装依赖 `npm ci --cache /tmp/npm-cache`

## 代码约定

- 一维排布一律 flex + `gap-*`（行、列、嵌套、两栏分比例）；每列写 `min-w-0`；`items-start` 只写在行方向；条件渲染的间距用父层 `gap`，不用 `space-y-*`；列里的裸件要内容宽写 `self-start`
- `grid` 只给真二维（现仅元数据表）并显式写列模板；`<label>` 只包一个控件，一组选项用 `<div role="group" aria-label>`
- 界面符号用图标组件（`ui/icons.tsx` 包 `lucide-preact`），不写字体字符；分隔线、下划线用元素画；依赖按需装、不抄精简版
- 一个知识只有一个定义（含注释）：文案 `lib/copy.ts`、内容 `lib/outro.ts`、框外观 `ui/inputs.tsx`、动效 `ui/tokens.ts`、可点整行 `ui/LinkList.tsx`、画布几何 `lib/frame.ts`、目录表 `_registry.ts(x)`
- 存图＝把屏幕上那一份装进 SVG 给浏览器画到画布，一档一颗按钮，无第二套渲染路径（`lib/image.ts`）：克隆外壳带 CSS 装进 SVG 视口，视口是 `data-card` 那块（外壳按设计宽摆好、左移空出的那段）；设计宽与比例写死在 `OUTPUTS`，出图前挂进屏幕外取景台按那个宽排；装进 `<img>` 的是 `data:` URL，**不能换回 `blob:`**——Chromium 系把「blob 里装着 `foreignObject` 的 SVG」判成异源，画到画布上会把画布弄脏、`toBlob` 直接抛 SecurityError（Firefox 不脏，所以只在 Chromium 上露，2026-09 实测）
- 设计宽只定档不定卡片宽（钉 `min-width` 会盖掉宽度上限）；`data-card` 宽钉回克隆、高由卡片定，克隆里摘掉「至少一屏高」；画布四周留**拍下来那一块**较长边的四分之一（不少于），按比例补齐、倍率写死 2
- 控件与卡片分开：最终页无控件，返回靠点任意处，动作在向导第三步
- 问卷是数据：题目写 `into`（`meta` / `block` / `title` / `footer`）决定答案去处，要加工才写 `build`；答完以 `DEFAULT_CARD` 为底盖答到的部分，不是清空（问到却答空的标题、页脚写空串，空元数据与文本块丢掉）
- 回到表单：内容已成型停最后一步（`formAtLastStep`），重置回第一步，其余时候表单记住你看过的那一步——步骤是表单自己的状态，地址里不带它；按钮四种变体只差颜色（外高 40px、内边距 32px、描边 1px），危险动作靠颜色与文案
- 页脚链接是导航清单（`ui/LinkList.tsx`）：`nav > ul > li > a`，竖向紧挨，平时淡、悬停转 blue 加下划线；同一标题层级同款，共用 `tokens.ts` 的 `HEADING`
- 模块里一行算式用 `const` 箭头，要写块的用 `function` 声明；组件一律 `function`——同一种东西不因为顺手就换写法
- 注释写中文，只写设计想法，不写实现、数值、类名；常量与 prop 的说明要留；迁移锚点只认旧档
- 不写自定义 CSS，例外只有 `style.css` 的 `.safe-area` 与 `@custom-variant press`；Tailwind 扫描来源写死在 `style.css` 的 `source(none)` + `@source`，加新目录要补

## 响应式

- 档位只看宽度（数在 `@theme`，代码里无宽度数字）：窄 < 30rem（`narrow:`）、中（默认）、大 ≥ 64rem（`wide:`）；`landscape:` / `portrait:` 已退役
- 窄与宽量的是框（容器查询）：页面里框＝页面宽、出图时框＝设计宽；量具只有 `PageShell` 一处；判据写 `(width >= 数字)` / `(width < 数字)`
- 窄屏是一维的流：容器不留横向留白，面贴边、去侧边描边圆角，留白由文字与控件自己带一次 `px-inset`（全站唯一 16）；裸控件与贴边面里的裸文字、裸列表自己补
- 元数据行窄屏上下排（编辑态与清单同规矩）：名称与值算一条，对内紧于条间；最终页除外
- 换行由档位或内容定：结构按档位写死（页脚两端、动作行、两栏），`flex-wrap` 只给条数由数据决定的排
- 动效只有渐变，清单在 `tokens.ts`（透明度、文字色、底色、描边色、显示）；150ms、ease-out、不回弹，`motion-reduce` 下不动；几何量不插值；跨档不做动画
- 可点件写 `press:`（带媒体查询的悬停加裸按下），只写 `hover:` 在触摸设备零反馈；反馈是元素自己变色，不位移不换形
- 最终页（`OutroPage`）跟三档，是拿去截图的那一屏：要一致的是栏（一行）宽，容器上限按栏宽反推；横竖居中，内容更高退回顶部；三段同一 flex 列、间距 12，宽档才分栏；不按档位改结构

## 内容与文案

- 类别名写全；选项是常用值不是全集，长单选留「自定义」，自写的也能进结尾页
- 多行题的选项是一整段、竖排成整宽块，点一条整段填进框；互斥、点「自定义」才出框、× 退回
- 没有兜底文案：标题块连横线、页脚署名行都不渲染；条件渲染的间距用 `gap`；占位提示只有两句（「不显示」与自定义形态里的「自己写」）；预填值不显示就不写
- 空答案丢掉、空清单段放虚线提示（提示只带框内内边距，清单窄屏内边距写在有内容的分支上）；不截断，写长了就换行
- 文案不为某一档定制：不写方位、不暗示结构（「右侧」「右上角」「第 N 步」都会失效），指位置用不随档位变的粗说法

## 环境

- Vite + Preact + TS（strict）+ Tailwind v4 + `vite-plugin-singlefile`；图标 `lucide-preact`（按需）；存图不装库
- 仓库 `omninbs/outro`，线上 https://omninbs.github.io/outro/；数据存 localStorage（`outro.card.v2`，旧键迁移），无后端
- 发布：push 到 main 由 deploy.yml 自动跑（卡住的 run 去 Actions 取消）；发别人 `cp dist/index.html dist/outro.html`（`file://` 可开）；`viewport-fit=cover` 与 `.safe-area` 是一对，删 meta 静默失效
