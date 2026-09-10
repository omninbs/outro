import type { ComponentChildren } from 'preact';

/**
 * 页面外壳：撑满一屏、上色，并且只在这里挂一次安全区。
 *
 * 向导不指定调色板类，跟随系统：@catppuccin 的 mocha.css 里 `:root` 默认是 latte（亮色），
 * 只有系统偏好暗色时才切成 mocha，所以 color-scheme 也交给系统（scheme-light-dark），
 * 否则会出现「亮色页面配暗色滚动条」。最终页永远传 theme="latte"，固定亮色。
 */
export function PageShell({ theme, children }: { theme?: 'latte'; children: ComponentChildren }) {
	return (
		<div
			class={`safe-area flex min-h-dvh flex-col bg-ctp-base text-ctp-text antialiased ${
				theme === 'latte' ? 'latte scheme-light' : 'scheme-light-dark'
			}`}
		>
			{children}
		</div>
	);
}
