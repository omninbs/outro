import type { ComponentChildren } from 'preact';

import { HOVER } from './tokens';

/**
 * 链接行：一整行都是入口——占满所在的那一栏，上下留出可点的内边距，所以点哪儿都行。
 * 看着像链接，实质是一行**没有框**的选项：没有描边、平时也没有底色，悬停才浮出一点淡底
 * 把「这一条整行都能点」画出来，同时文字自己转 blue 并加下划线——就是它「变回链接」的样子。
 *
 * 悬停那点底色用 `surface0/40`，跟首页那些可点卡片同一个值；上下 `py-2` 是为了高度：
 * 行宽铺满一栏之后，窄的上下内边距会显得这条很扁，可点范围也小（2026-09 用户提的）。
 * 下划线加粗到 0.1em、下沉 0.25em，这两笔照参考站 book.kemya.net 的页脚，少了会显得糙。
 *
 * 用 `<a>` 而不是 `<button>`：块级的 `<a>` 天然撑满那一栏，而 `<button>` 的宽度按内容收缩，
 * 写 `block` 之后也只有文字那么宽，「点哪儿都行」就成了空话（2026-09 探针量到 64px vs 367px）。
 * 顺带拿到浏览器自己的链接本领：中键、右键复制地址都照常。
 *
 * 应用内的目标也写成 hash——路由本来就是 hash，首页是那个空 fragment 的 `#`，
 * 所以内部跳转不用 `onClick`，地址本身就是那个入口。
 */
export function LinkRow({
	href,
	external,
	children,
}: {
	href: string;
	/** 外链：开新标签页。这个工具是拿来当片尾用的，中途跳走会丢掉正在填的内容 */
	external?: boolean;
	children: ComponentChildren;
}) {
	return (
		<a
			href={href}
			target={external ? '_blank' : undefined}
			rel={external ? 'noreferrer' : undefined}
			class={`block py-2 text-ctp-subtext0 hover:bg-ctp-surface0/40 hover:text-ctp-blue hover:underline decoration-[0.1em] underline-offset-[0.25em] ${HOVER}`}
		>
			{children}
		</a>
	);
}
