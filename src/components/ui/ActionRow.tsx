import type { ComponentChildren } from 'preact';

// 页面底部的动作行：一头退出/后退、一头前进，收成组件；窄屏是裸内容，横向留白自己带一次
export function ActionRow({ children }: { children: ComponentChildren }) {
	return <div class="flex items-center justify-between narrow:px-inset">{children}</div>;
}
