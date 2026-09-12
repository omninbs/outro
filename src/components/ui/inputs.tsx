import type { ComponentChildren } from 'preact';

import { RISE } from './tokens';

// 裸控件的外观：洗掉框的外表只留文字，横向留白只该有一层，所以要常量不是组件
export const BARE_INPUT =
	'rounded border-none bg-transparent px-2 py-1.5 text-base narrow:px-0 ' +
	'placeholder:text-ctp-overlay0 focus:outline-none';

// 框的长相：底色、描边、圆角，留白与排布归用处，所以是常量不是组件
export const BOX = 'rounded-md border border-ctp-surface0 bg-ctp-crust';

// 一行式的框：全应用只有这一处定义「框」，窄屏贴边、横向留白自己带一次
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

// 单行输入：框的一种填法，带 × 的自定义框只是多一个行尾动作，两者同高
export function TextInput({
	value,
	on_input,
	placeholder,
	action,
}: {
	value: string;
	on_input: (value: string) => void;
	placeholder?: string;
	// 行尾的动作，比如退回选项的 ×
	action?: ComponentChildren;
}) {
	return (
		<BareRow action={action}>
			<input
				type="text"
				value={value}
				placeholder={placeholder}
				class={`min-w-0 flex-1 text-ctp-text ${BARE_INPUT}`}
				onInput={(e) => on_input(e.currentTarget.value)}
			/>
		</BareRow>
	);
}

// 多行框的高度：行数是框自己的事，写死在这儿、不开成 prop
const TEXTAREA_ROWS = 3;

// 裸的多行框：自己不套框，套成一行还是一列由用处定
export function BareTextArea({
	value,
	on_input,
	placeholder,
}: {
	value: string;
	on_input: (value: string) => void;
	placeholder?: string;
}) {
	return (
		<textarea
			value={value}
			rows={TEXTAREA_ROWS}
			placeholder={placeholder}
			class={`w-full resize-y leading-relaxed text-ctp-text ${BARE_INPUT}`}
			onInput={(e) => on_input(e.currentTarget.value)}
		/>
	);
}

// 多行版的「框 + 裸控件」，行尾动作与单行版同一个意思
export function TextArea({
	action,
	...props
}: {
	value: string;
	on_input: (value: string) => void;
	placeholder?: string;
	// 行尾的动作，比如退回选项的 ×
	action?: ComponentChildren;
}) {
	return (
		<BareRow action={action}>
			<BareTextArea {...props} />
		</BareRow>
	);
}
