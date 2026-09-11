import type { ComponentChildren } from 'preact';

import { RISE } from './tokens';

/**
 * 裸控件的外观：把框那层外表洗掉，只留文字自己。宽度与配色归调用方，所以要的是常量不是组件。
 * 横向那道留白只该有一层——窄屏归外面的框，控件再带一道会叠成两道，字也落不到全页那条竖线上。
 */
export const BARE_INPUT =
	'rounded border-none bg-transparent px-2 py-1.5 text-base narrow:px-0 ' +
	'placeholder:text-ctp-overlay0 focus:outline-none';

/**
 * 框的长相：底色、描边、圆角。留白与排布归用处自己——它有时当一行、有时当一列，所以是常量不是组件。
 */
export const BOX = 'rounded-md border border-ctp-surface0 bg-ctp-crust';

/**
 * 一行式的框：里面一个裸控件，行尾可以嵌一个动作。全应用只有这一处定义「框」，留白、描边、
 * 聚焦色于是不会各走各的，高度也自然一致；块编辑器那层外框不是它——那里套着正文，是一「列」。
 *
 * 窄屏它贴边成横跨整屏的一条带，横向留白改由它自己带一次，框里的字于是仍跟别处同一条竖线；
 * 跨这条线形状直接跳，只有新出现的那一行是淡进来的。
 */
export function BareRow({ children, action }: { children: ComponentChildren; action?: ComponentChildren }) {
	return (
		<div
			class={`${BOX} flex items-center gap-2 p-1.5 focus-within:border-ctp-mauve narrow:rounded-none narrow:border-x-0 narrow:px-inset ${RISE}`}
		>
			{children}
			{action}
		</div>
	);
}

/** 单行输入：框的一种填法，不是另造的控件——带 × 的自定义框只是多一个行尾动作，于是两者同高 */
export function TextInput({
	value,
	onInput,
	placeholder,
	action,
}: {
	value: string;
	onInput: (value: string) => void;
	placeholder?: string;
	/** 行尾的动作，比如退回选项的 × */
	action?: ComponentChildren;
}) {
	return (
		<BareRow action={action}>
			<input
				type="text"
				value={value}
				placeholder={placeholder}
				class={`min-w-0 flex-1 text-ctp-text ${BARE_INPUT}`}
				onInput={(e) => onInput(e.currentTarget.value)}
			/>
		</BareRow>
	);
}

/** 多行框的高度：行数是「框」自己的事，写死在这儿、不开成 prop——调用点管内容不管控件多高，要写长的人自己往下拉 */
const TEXTAREA_ROWS = 3;

/** 裸的多行框：自己不套框，外面套成一行还是套成一列由用处定 */
export function BareTextArea({
	value,
	onInput,
	placeholder,
}: {
	value: string;
	onInput: (value: string) => void;
	placeholder?: string;
}) {
	return (
		<textarea
			value={value}
			rows={TEXTAREA_ROWS}
			placeholder={placeholder}
			class={`w-full resize-y leading-relaxed text-ctp-text ${BARE_INPUT}`}
			onInput={(e) => onInput(e.currentTarget.value)}
		/>
	);
}

/** 多行版的「框 + 裸控件」；行尾动作与单行版同一个意思——带预设的多行题也有自定义形态 */
export function TextArea({
	action,
	...props
}: {
	value: string;
	onInput: (value: string) => void;
	placeholder?: string;
	/** 行尾的动作，比如退回选项的 × */
	action?: ComponentChildren;
}) {
	return (
		<BareRow action={action}>
			<BareTextArea {...props} />
		</BareRow>
	);
}
