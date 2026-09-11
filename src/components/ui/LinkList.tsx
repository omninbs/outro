import { HOVER } from './tokens';

/** 一条链接：文案 + 目标；外链多一个 `external`（开新标签页） */
export type LinkItem = {
	text: string;
	href: string;
	external?: boolean;
};

/**
 * 链接清单：一串整行可点的链接，竖向紧挨着排。它是**自成一体**的一样东西——行为像按钮
 * （点哪儿都行）、长相像链接（次要文字，悬停才转主色加下划线）、排列像清单；三样凑成的
 * 就是「导航清单」，语义也照清单来：`<nav>` 里挂 `<ul>`，每项一个 `<li>` 一个 `<a>`。
 * 不要换成 `<button>`——这里干的是跳转不是动作，而且块级链接天然撑满那一栏，按钮却按内容收缩。
 *
 * 行与行之间不写外边距，上下内边距就是行自己的高度，两行紧挨着成一条连续的带子；内边距要给够，
 * 否则这条带子显得扁、可点范围也小。悬停只变文字色加下划线（链接自己的那种反应），**不填底色**
 * ——底色一浮出来就更像按钮，而它要的是「看着像链接」。应用内的目标也写成 hash：路由本来就是
 * hash，内部跳转于是不用点事件，还白拿浏览器自己的链接本领（中键、右键复制地址照常）。
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
