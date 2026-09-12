import { HOVER } from './tokens';

// 一条链接：文案 + 目标，外链多一个 external（开新标签页）
export type LinkItem = {
	text: string;
	href: string;
	external?: boolean;
};

// 链接清单：整行可点、竖排紧挨，语义是 nav > ul > li > a，悬停只变文字色加下划线、不填底色
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
