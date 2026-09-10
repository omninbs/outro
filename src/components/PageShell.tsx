import type { ComponentChildren } from 'preact';

import { PageFooter } from './PageFooter';

/**
 * 页面外壳：撑满一屏、上色、挂页脚，并且只在这里挂一次安全区。
 *
 * 向导不指定调色板类，跟随系统：@catppuccin 的 mocha.css 里 `:root` 默认是 latte（亮色），
 * 只有系统偏好暗色时才切成 mocha，所以 color-scheme 也交给系统（scheme-light-dark），
 * 否则会出现「亮色页面配暗色滚动条」。最终页永远传 theme="latte"，固定亮色。
 *
 * 页脚是这个外壳的一部分，页面不用自己写；最终页要整屏截图，传 footer={false} 去掉。
 * 各页内容根节点都得是 `flex-1`，页脚的 mt-auto 才顶得到窗口底部。
 */
export function PageShell({
	theme,
	footer = true,
	children,
}: {
	theme?: 'latte';
	footer?: boolean;
	children: ComponentChildren;
}) {
	return (
		<div
			class={`safe-area flex min-h-dvh flex-col bg-ctp-base text-ctp-text antialiased ${
				theme === 'latte' ? 'latte scheme-light' : 'scheme-light-dark'
			}`}
		>
			{children}
			{footer && <PageFooter />}
		</div>
	);
}
