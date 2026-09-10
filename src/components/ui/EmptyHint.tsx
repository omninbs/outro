import type { ComponentChildren } from 'preact';

/** 列表还空着时的虚线占位块 */
export function EmptyHint({ children }: { children: ComponentChildren }) {
	return (
		<p class="rounded-md border border-dashed border-ctp-surface1 px-3 py-4 text-center text-base text-ctp-overlay0">
			{children}
		</p>
	);
}
