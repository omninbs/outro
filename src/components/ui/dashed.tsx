import type { ComponentChildren } from 'preact';

import { PlusIcon } from './icons';
import { HOVER } from './tokens';

// 虚框的长相：一块用虚线围出来的空位，窄屏一样贴边，横向留白由里面自己带
const DASHED =
	'rounded-md border border-dashed border-ctp-surface1 narrow:rounded-none narrow:border-x-0 narrow:px-inset';

// 虚框按钮的壳：铺一块虚框、竖排若干行，高度随行数走
function DashedButton({
	on_click,
	tall,
	children,
}: {
	on_click: () => void;
	tall: boolean;
	children: ComponentChildren;
}) {
	return (
		<button
			type="button"
			onClick={on_click}
			class={`${DASHED} flex w-full flex-col items-center justify-center gap-3 text-base text-ctp-subtext0 press:border-ctp-mauve press:text-ctp-mauve ${
				tall ? 'py-6' : 'py-2'
			} ${HOVER}`}
		>
			{children}
		</button>
	);
}

// 空位的一种：只说明这一处还没有内容
export function EmptyHint({ children }: { children: ComponentChildren }) {
	return <p class={`${DASHED} px-3 py-4 text-center text-base text-ctp-overlay0`}>{children}</p>;
}

// 空位的另一种：列表末尾那个入口；列表空着时兼作空态，上面多一行说明，纵向也更高
export function AddButton({
	on_click,
	is_empty,
	children,
}: {
	on_click: () => void;
	is_empty: boolean;
	children: ComponentChildren;
}) {
	return (
		<DashedButton on_click={on_click} tall={is_empty}>
			{is_empty && <span class="text-ctp-overlay0">没有内容</span>}
			<span class="flex items-center gap-2">
				<PlusIcon />
				{children}
			</span>
		</DashedButton>
	);
}
