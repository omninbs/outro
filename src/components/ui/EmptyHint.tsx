import type { ComponentChildren } from 'preact';

/**
 * 列表还空着时的虚线占位块：窄屏照样贴边、去侧边描边，只有里面的字留出那一次留白。
 * 它不带任何动效——出现与消失是整块列表的事，它自己身上没有会变的东西。
 */
export function EmptyHint({ children }: { children: ComponentChildren }) {
	return (
		<p
			class="rounded-md border border-dashed border-ctp-surface1 px-3 py-4 text-center text-base text-ctp-overlay0 narrow:rounded-none narrow:border-x-0 narrow:px-inset"
		>
			{children}
		</p>
	);
}
