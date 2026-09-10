import type { ComponentChildren } from 'preact';

/**
 * 页脚：贴在页面底部的一条淡色链接。
 *
 * 「离开当前页」这类动作放这里，标题旁边挂按钮不好看。
 * 内容短的时候也要落在窗口底部，所以靠外层 flex 列的 mt-auto 顶下去——
 * 调用方的容器必须是 `flex flex-1 flex-col`，否则 mt-auto 不起作用。
 */
export function PageFooter({ children }: { children: ComponentChildren }) {
	return <footer class="mt-auto pt-12 text-base tracking-wide text-ctp-overlay0">{children}</footer>;
}
