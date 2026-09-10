import type { ComponentChildren } from 'preact';

import { MORPH } from './tokens';

/** 列表还空着时的虚线占位块。窄屏照样贴边去侧边描边，只有里面的字留出那个 inset */
export function EmptyHint({ children }: { children: ComponentChildren }) {
	return (
		<p
			class={`rounded-md border border-dashed border-ctp-surface1 px-3 py-4 text-center text-base text-ctp-overlay0 max-narrow:rounded-none max-narrow:border-x-0 max-narrow:px-inset ${MORPH}`}
		>
			{children}
		</p>
	);
}
