import type { ComponentChildren } from 'preact';

import { pageContainer, type PageWidth } from '../lib/layout';
import { PageFooter } from './PageFooter';

/**
 * 页面外壳：撑满一屏、上色、套页面容器、挂页脚——每一页共有的事都在这里做一次，安全区也只挂一次。
 * 宽度归这里管，页面自己不再定宽；页脚却是固定件、宽度自己管，跟所在页面的容器无关。
 * 调色板默认交给系统（连滚动条一起交，免得亮色页面配暗色滚动条），只有最终页固定亮色；
 * 最终页要的是整屏截图，所以既不套容器也不带页脚。宽度只有那几档，见 `AGENTS.md` 的「响应式」。
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
