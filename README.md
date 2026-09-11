# outro

填几个字段，导出一张能直接当视频结尾页的图。

- 三种入口：不用预设自己填，或者让一份问卷把你问一遍
- 三档成品：竖版 2:3、方版 1:1、横版 3:2，点一下直接存成 PNG
- 内容存在你自己的浏览器里（localStorage），没有后端，什么都不上传

## 用它

线上：https://omninbs.github.io/outro/

想要一个能离线、双击就能打开的单文件：跑一次 `npm run build`，把 `dist/index.html` 发给对方即可（`file://` 打开照常能用）。

## 开发

```bash
npm ci
npm run dev        # http://localhost:5173
npm run typecheck  # 类型
npm test           # 纯函数的单测：数据搬运、存档迁移、内容过滤
npm run build      # 产出一个 dist/index.html
```

技术栈：Vite + Preact + TypeScript（strict）+ Tailwind v4，产物由 `vite-plugin-singlefile` 内联成单个 HTML 文件；存图走浏览器自己的 SVG + 画布，不装图形库。

## 它是怎么想的

设计与取舍写在 [`AGENTS.md`](./AGENTS.md)——那份文件是写给 AI 的干活规矩，但里面每一条都是一次设计决定：
档位按**框**的宽判（同一份版面在页面里与出图时是同一个定义，不随观者的窗口变）、文案与内容各只有一个定义处、
最终页就是拿去截图的那一屏（存下来的图是它的克隆，不是第二套渲染）。

## 许可

MIT

> 这个项目的代码与文档由 AI 与作者共同写成。
