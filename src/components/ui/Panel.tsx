import type { ComponentChildren } from 'preact';

import { CARD_HEADING, HOVER } from './tokens';

/**
 * 卡片的长相。窄屏它不再是一张「卡片」：横向贴边，变成横跨整屏的一条带，横向留白改由里面的文字
 * 自己带一次——贴边的面没法再给内容留边，裸文字与裸列表都得自己带；跨这条线形状直接换，不收放。
 */
const CARD =
	'flex flex-col gap-4 rounded-lg border border-ctp-surface0 bg-ctp-mantle p-5 ' +
	'narrow:rounded-none narrow:border-x-0 narrow:px-0';

/**
 * 步骤里的一块内容：标题 + 卡片。整块可点时给 `href`——标题上的链接铺满整张卡片，
 * 于是「点哪儿都行」与「标题还是标题」同时成立：按钮只收行内内容，装不下标题，
 * 而这里干的本来就是跳转不是动作，地址还能中键新开、右键复制。
 */
export function Panel({
	title,
	href,
	children,
}: {
	title?: string;
	/** 给了它就是整块可点的入口：链接的名字就是标题 */
	href?: string;
	children: ComponentChildren;
}) {
	const head = title && (
		<h2 class={`text-lg ${CARD_HEADING} narrow:px-inset`}>
			{href ? (
				/* `after` 那一层铺满卡片：点哪儿都行，链接自己还是链接 */
				<a href={href} class="after:absolute after:inset-0 after:content-['']">
					{title}
				</a>
			) : (
				title
			)}
		</h2>
	);

	/* 可点件的反馈挂在卡片自己身上：指针落在卡片哪儿，描边与底色都跟着变 */
	const shell = href ? `${CARD} relative press:border-ctp-mauve press:bg-ctp-surface0/40 ${HOVER}` : CARD;

	return (
		<section class={shell}>
			{head}
			{children}
		</section>
	);
}
