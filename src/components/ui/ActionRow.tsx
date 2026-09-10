import type { ComponentChildren } from 'preact';

/**
 * 页面底部的动作行：左边是退出 / 后退，右边是前进。
 *
 * 向导页和问卷页各有一处，间距与对齐是同一件事——各写一遍就会各改各的，
 * 所以收成组件；将来要加 gap 或换行行为，也只改这一处。
 */
export function ActionRow({ children }: { children: ComponentChildren }) {
	return <div class="mt-6 flex items-center justify-between">{children}</div>;
}
