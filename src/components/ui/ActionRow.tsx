import type { ComponentChildren } from 'preact';

/**
 * 页面底部的动作行：一头是退出 / 后退，一头是前进。向导页与问卷页各有一处，间距与对齐是同一件事，
 * 各写一遍迟早各改各的，所以收成一个组件；窄屏它是容器里的裸内容，横向留白得自己带一次。
 */
export function ActionRow({ children }: { children: ComponentChildren }) {
	return <div class="flex items-center justify-between narrow:px-inset">{children}</div>;
}
