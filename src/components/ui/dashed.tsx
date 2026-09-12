import type { ComponentChildren } from 'preact';

import { PlusIcon } from './icons';
import { HOVER } from './tokens';

// 虚框的长相：一块用虚线围出来的空位，窄屏一样贴边，横向留白由里面自己带
const DASHED =
	'rounded-md border border-dashed border-ctp-surface1 narrow:rounded-none narrow:border-x-0 narrow:px-inset';

// 虚框按钮的长相：铺一块虚框、竖排若干行
const DASHED_BUTTON =
	`${DASHED} flex w-full flex-col items-center justify-center gap-3 text-base ` +
	`text-ctp-subtext0 press:border-ctp-mauve press:text-ctp-mauve ${HOVER}`;

// 空位的一种：只说明这一处还没有内容
export function EmptyHint({ children }: { children: ComponentChildren }) {
	return <p class={`${DASHED} px-3 py-4 text-center text-base text-ctp-overlay0`}>{children}</p>;
}

// 空位的另一种：列表末尾那个入口；列表空着时兼作空态
export function AddButton({
	on_click,
	empty,
	children,
}: {
	on_click: () => void;
	empty?: ComponentChildren;
	children: ComponentChildren;
}) {
	// 空态多一行说明，纵向也高些
	const box = `${DASHED_BUTTON} ${empty ? 'py-6' : 'py-2'}`;

	return (
		<button type="button" onClick={on_click} class={box}>
			{empty && <span class="text-ctp-overlay0">{empty}</span>}
			<span class="flex items-center gap-2">
				<PlusIcon />
				{children}
			</span>
		</button>
	);
}
