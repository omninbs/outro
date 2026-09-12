import type { ComponentChildren } from 'preact';

import { page_container, type PageWidth } from '../lib/layout';
import { PageFooter } from './page_footer';

// 页面外壳：撑满一屏、上色、套容器、挂页脚；宽度归这里管，也是版面的量具
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
			class={`safe-area flex min-h-dvh flex-col bg-ctp-base text-ctp-text antialiased [container-type:inline-size] ${
				theme === 'latte' ? 'latte scheme-light' : 'scheme-light-dark'
			}`}
		>
			{width === null ? (
				children
			) : (
				<div class={`${page_container(width)} flex flex-1 flex-col py-12`}>{children}</div>
			)}
			{footer && width !== null && <PageFooter />}
		</div>
	);
}
