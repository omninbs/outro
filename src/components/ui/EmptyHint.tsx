import type { ComponentChildren } from 'preact';

import { DASHED } from './inputs';

// 列表还空着时的虚线占位块：窄屏照样贴边，只有里面的字留出留白
export function EmptyHint({ children }: { children: ComponentChildren }) {
	return <p class={`${DASHED} px-3 py-4 text-center text-base text-ctp-overlay0`}>{children}</p>;
}
