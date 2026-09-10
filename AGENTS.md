# outro —— 在这里干活的规矩

结尾页生成器：填几个字段，产出一张可以直接截图的结尾页。给 AI 看的东西都写这一份，改规矩就改这里。

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

## 验证

没有 lint，这两个命令就是全部闸门，改完必跑：

```bash
npm run typecheck   # tsc --noEmit
npm run build       # vite build，产出单文件 dist/index.html
```

- dev server 在 http://localhost:5173（常年有一个后台任务跑着，**不要另起一个**）；改完文件 Vite 自己热更新
- 注意 Vite 的开发态转换按秒缓存：同一秒里连改同一个文件两次，可能喂出半新半旧的模块，`touch` 一下强制重转
- 装依赖用 `npm ci --cache /tmp/npm-cache`（沙箱里默认缓存目录只读）
- 产物是自包含的单个 HTML，验线上就是 `curl` 下来比字节数、grep 字样

## 代码约定

- **一个知识只有一个定义**。界面文案集中在 `src/lib/copy.ts`（只收两处以上用到的，值相同不等于同一条知识）；内容长什么样由 `src/lib/outro.ts` 的 `resolveOutro` 一处决定
- 目录表叫 `_registry.ts(x)`：`src/surveys/` 是首页那些入口（全是数据，加一份 = 加一个文件 + 加一行）、`src/steps/` 是向导三步
- 注释写中文，写「为什么这么做」，不写「这行在做什么」
- 不写自定义 CSS：Tailwind v4 + catppuccin 的 `ctp-*` token 够用了
- 响应式只看方向：`landscape:` / `portrait:`（比宽高），不用像素断点
- 路由用 hash（`#form`、`#outro`、`#<入口 id>`）：构建产物要能直接 `file://` 打开

## 环境

- 技术栈：Vite + Preact + TypeScript（strict）+ Tailwind v4 + `vite-plugin-singlefile`
- 仓库：`omninbs/outro`，公开；线上 https://omninbs.github.io/outro/
- 数据存在浏览器 localStorage（`outro.card.v2`），不经过任何后端
