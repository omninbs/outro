import type { ComponentChildren } from 'preact';

import { HOVER } from './tokens';

/**
 * 卡片的长相。窄屏它不再是一张「卡片」：横向贴边，变成横跨整屏的一条带，横向留白改由里面的文字
 * 自己带一次——贴边的面没法再给内容留边，裸文字与裸列表都得自己带；跨这条线形状直接换，不收放。
 */
const CARD =
	'rounded-lg border border-ctp-surface0 bg-ctp-mantle p-5 ' +
	'narrow:rounded-none narrow:border-x-0 narrow:px-0';

/**
 * 步骤里的一块内容：标题 + 卡片。整块可点时它自己就是入口（首页选开始方式），
 * 所以里面不再放按钮——按钮套按钮既不合规，点哪儿都得瞄准一下也不符合直觉。
 */
export function Panel({
	title,
	onClick,
	children,
}: {
	title?: string;
	onClick?: () => void;
	children: ComponentChildren;
}) {
	const head = title && (
		<h2 class="mb-4 text-lg font-semibold tracking-wide text-ctp-subtext1 narrow:px-inset">{title}</h2>
	);

	if (!onClick) {
		return (
			<section class={CARD}>
				{head}
				{children}
			</section>
		);
	}

	return (
		<button
			type="button"
			onClick={onClick}
			class={`${CARD} block w-full cursor-pointer text-left press:border-ctp-mauve press:bg-ctp-surface0/40 ${HOVER}`}
		>
			{head}
			{children}
		</button>
	);
}
