import { HOVER } from './tokens';

/** 一条链接：文案 + 目标；外链多一个 `external`（开新标签页） */
export type LinkItem = {
	text: string;
	href: string;
	external?: boolean;
};

/**
 * 链接清单：一串整行可点的链接，从上到下紧挨着排、行与行之间不留缝。
 *
 * 它是**自成一体**的一样东西——既不是按钮，也不是正文里那种行内链接：
 * 行为像整宽的按钮（点哪儿都行），长相却像链接（平时是淡一档的次要文字，悬停才转 blue
 * 并加下划线），而且是竖向排列、没有间隙的。三样凑在一起，它就是一份**导航清单**，
 * 所以语义也照清单来：`<nav>` 里挂一个 `<ul>`，每项一个 `<li>` 一个 `<a>`
 * （`PageFooter` 就是这么用的）。**不要**换成 `<button>`：这里干的是「跳转」不是「执行动作」，
 * 而且块级的 `<a>` 天然撑满那一栏，`<button>` 的宽度却按内容收缩，写 `block` 也只有文字那么宽
 * （2026-09 探针量到 64px vs 367px，「点哪儿都行」就成了空话）。
 *
 * 行与行之间**不写 margin / gap**：上下内边距就是行自己的高度，两行因此紧挨着，
 * 点起来是一整条连续的带子。用 `py-2` 而不是 `py-1`，是因为行宽铺满一栏之后，
 * 窄的上下内边距会让这条显得很扁、可点范围也小（2026-09 用户提的）。
 *
 * 悬停**不填底色**：底色一浮出来就更像按钮了，它要的是「看着像链接」，只变文字色。
 * 下划线加粗到 0.1em、下沉 0.25em，照参考站 book.kemya.net 的页脚——那边也只有颜色变化。
 *
 * 应用内的目标也写成 hash：路由本来就是 hash，首页就是那个空 fragment 的 `#`，
 * 所以内部跳转不用 `onClick`，地址本身就是那个入口。顺带白拿浏览器自己的链接本领：
 * 中键、右键复制地址都照常。
 */
export function LinkList({ items }: { items: readonly LinkItem[] }) {
	return (
		<ul>
			{items.map((item) => (
				<li key={item.href}>
					<a
						href={item.href}
						target={item.external ? '_blank' : undefined}
						rel={item.external ? 'noreferrer' : undefined}
						class={`block py-2 text-ctp-subtext0 press:text-ctp-blue press:underline decoration-[0.1em] underline-offset-[0.25em] ${HOVER}`}
					>
						{item.text}
					</a>
				</li>
			))}
		</ul>
	);
}
