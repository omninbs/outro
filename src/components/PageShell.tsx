import type { ComponentChildren } from 'preact';

import { pageContainer, type PageWidth } from '../lib/layout';
import { PageFooter } from './PageFooter';

/**
 * 页面外壳：撑满一屏、上色、套页面容器、挂页脚，并且只在这里挂一次安全区。
 *
 * 页面容器宽度由这里统一决定（内容按 width 定宽），页面自己不再写 max-w 与左右内边距。
 * 页脚是固定件，宽度自己管，跟所在页面的容器无关。
 *
 * 向导不指定调色板类，跟随系统：@catppuccin 的 mocha.css 里 `:root` 默认是 latte（亮色），
 * 只有系统偏好暗色时才切成 mocha，所以 color-scheme 也交给系统（scheme-light-dark），
 * 否则会出现「亮色页面配暗色滚动条」。最终页永远传 theme="latte"，固定亮色。
 *
 * 最终页自己排版，传 width={null} 不套容器，并且 footer={false} 去掉页脚（要整屏截图）。
 */
export function PageShell({
	theme,
	width = 'wide',
	footer = true,
	children,
}: {
	theme?: 'latte';
	width?: PageWidth | null;
	footer?: boolean;
	children: ComponentChildren;
}) {
	return (
		<div
			class={`safe-area flex min-h-dvh flex-col bg-ctp-base text-ctp-text antialiased ${
				theme === 'latte' ? 'latte scheme-light' : 'scheme-light-dark'
			}`}
		>
			{width === null ? (
				children
			) : (
				<div class={`${pageContainer(width)} flex flex-1 flex-col py-12`}>{children}</div>
			)}
			{footer && width !== null && <PageFooter />}
		</div>
	);
}
