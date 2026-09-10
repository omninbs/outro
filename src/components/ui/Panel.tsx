import type { ComponentChildren } from 'preact';

import { MORPH, TAP } from './tokens';

/**
 * 卡片外观。窄屏（`max-narrow`）它不再是一张「卡片」：横向贴边、去掉侧边描边与圆角，
 * 变成横跨整屏的一条「带」；横向留白改由里面的文字自己带一次（`px-inset`）。
 * 跨这条线时那几样是一起过渡过去的（`MORPH`）——看上去像卡片慢慢长成带，而不是啪地换一张脸。
 *
 * 注意「里面的文字自己带」这件事：贴边的面没法再给内容留边，
 * 所以卡片里凡是裸文字 / 裸列表，都得自己写 `max-narrow:px-inset`
 * （`Field` 的标签、`FilledList` 的内容、首页卡片的说明、`GenerateStep` 的正文都是这么办的）。
 */
const CARD =
	'rounded-lg border border-ctp-surface0 bg-ctp-mantle p-5 ' +
	'max-narrow:rounded-none max-narrow:border-x-0 max-narrow:px-0 ' +
	MORPH;

/**
 * 步骤里的一块内容：标题 + 圆角卡片。
 *
 * 给了 onClick 就整块可点——那种卡片本身就是入口（首页选开始方式），
 * 所以里面不该再放按钮：按钮套按钮既不合规，点哪儿都要瞄准一下也不符合直觉。
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
		<h2 class="mb-4 text-lg font-semibold tracking-wide text-ctp-subtext1 max-narrow:px-inset">{title}</h2>
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
			class={`${CARD} block w-full cursor-pointer text-left hover:border-ctp-mauve hover:bg-ctp-surface0/40 ${TAP}`}
		>
			{head}
			{children}
		</button>
	);
}
