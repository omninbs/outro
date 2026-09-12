import type { ComponentChildren } from 'preact';

import { CARD_HEADING, HOVER } from './tokens';

// 卡片的长相：窄屏横向贴边成一条带，横向留白改由里面的文字自己带一次
const CARD =
	'flex flex-col gap-4 rounded-lg border border-ctp-surface0 bg-ctp-mantle p-5 ' +
	'narrow:rounded-none narrow:border-x-0 narrow:px-0';

// 步骤里的一块内容：标题 + 卡片，整块可点时给 href，标题上的链接铺满整张卡片
export function Panel({
	title,
	href,
	children,
}: {
	title?: string;
	// 给了它就是整块可点的入口：链接的名字就是标题
	href?: string;
	children: ComponentChildren;
}) {
	const head = title && (
		<h2 class={`text-lg ${CARD_HEADING} narrow:px-inset`}>
			{href ? (
				// after 那一层铺满卡片：点哪儿都行，链接自己还是链接
				<a href={href} class="after:absolute after:inset-0 after:content-['']">
					{title}
				</a>
			) : (
				title
			)}
		</h2>
	);

	// 可点件的反馈挂在卡片自己身上：指针落在卡片哪儿，描边与底色都跟着变
	const shell = href ? `${CARD} relative press:border-ctp-mauve press:bg-ctp-surface0/40 ${HOVER}` : CARD;

	return (
		<section class={shell}>
			{head}
			{children}
		</section>
	);
}
