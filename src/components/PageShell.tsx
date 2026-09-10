import type { ComponentChildren } from 'preact';

/**
 * 页面外壳：撑满一屏、上色，并且只在这里挂一次安全区。
 * 向导用 mocha（暗色），最终页传 theme="latte" 换成亮色；color-scheme 跟着一起换，
 * 免得亮色页面还配一条暗色滚动条。
 */
export function PageShell({ theme, children }: { theme?: 'latte'; children: ComponentChildren }) {
	return (
		<div
			class={`safe-area flex min-h-dvh flex-col bg-ctp-base text-ctp-text antialiased ${
				theme === 'latte' ? 'latte scheme-light' : 'scheme-dark'
			}`}
		>
			{children}
		</div>
	);
}
