import type { ComponentChildren } from 'preact';

import { RISE } from './tokens';

/**
 * 裸控件的外观：无边框、无底色，撑在框里。
 * 宽度、flex、文字色由调用方补，所以导出常量而不是组件。
 *
 * 窄屏（`max-narrow:px-0`）它不带横向内边距：那一道归外面的框（`BareRow`、块编辑器的外框）。
 * 框一道、控件一道就会叠成两道，文字也就落不到那条统一的竖线上。
 */
export const BARE_INPUT =
	'rounded border-none bg-transparent px-2 py-1.5 text-base max-narrow:px-0 ' +
	'placeholder:text-ctp-overlay0 focus:outline-none';

/**
 * 框的外观：crust 底、一圈描边、圆角。内边距与布局由用处决定，
 * 所以导出常量而不是组件——`BareRow` 是「一行」，块编辑器那个外框是「一列」。
 */
export const BOX = 'rounded-md border border-ctp-surface0 bg-ctp-crust';

/**
 * 输入框的框：crust 底、一圈描边，里面放裸控件，行尾可以嵌一个动作（目前只有 ×）。
 *
 * 全应用只有这一个「框」的定义——单行输入框、多行输入框、元数据那一行都用它，
 * 所以内边距、描边、圆角、聚焦色不可能各走各的，高度也自然一致：
 * 框里最高的东西说了算，裸输入框 36px（24px 行高 + 上下 6px）加框自己的上下 6px、
 * 加描边 2px = 50px；32px 的 × 一定矮于它，撑不出第二个高度。
 *
 * 块编辑器的外框不是它：那层框里还套着正文，是「一列」不是「一行」，只共用 `BOX`。
 *
 * 窄屏（`max-narrow`）它横向贴边、去掉侧边描边与圆角，变成横跨整屏的一条「带」，
 * 横向留白改由它自己带一次 `px-inset`——于是框里的文字跟页面上别处的文字同一条竖线。
 * 跨窄屏线时这几样是直接跳的（几何量不插值，见 `ui/tokens.ts`），身上带着 `RISE`：
 * 新挂上来的一行从透明淡进来，不「啪」地出现；聚焦时那道描边也在它的清单里，自然淡过去。
 */
export function BareRow({ children, action }: { children: ComponentChildren; action?: ComponentChildren }) {
	return (
		<div
			class={`${BOX} flex items-center gap-2 p-1.5 focus-within:border-ctp-mauve max-narrow:rounded-none max-narrow:border-x-0 max-narrow:px-inset ${RISE}`}
		>
			{children}
			{action}
		</div>
	);
}

/**
 * 单行输入框：一个框里只有一个裸输入框。
 *
 * 它是「框」的一种填法，不是另造一个控件——问卷里「自己写」那个带 × 的框，
 * 就是这里多传一个 `action`，所以两者的内边距与高度天生一样。
 */
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

/**
 * 多行框一律三行，没有例外——问卷的段落题和文本块的正文是同一件事，
 * 所以行数写死在这儿，不开成 prop：调用点管内容，不管控件有多高。
 * 纵向下拉可调（`resize-y`）留给要写更多的人，那才是他自己的事。
 */
const TEXTAREA_ROWS = 3;

/** 裸的多行框：自己不套框，两处套法不同（`BareRow` 里一个、块编辑器那层框里一个） */
export function BareTextArea({
	value,
	onInput,
	placeholder,
	class: extra = '',
}: {
	value: string;
	onInput: (value: string) => void;
	placeholder?: string;
	/** 只用来补外边距这类位置差异 */
	class?: string;
}) {
	return (
		<textarea
			value={value}
			rows={TEXTAREA_ROWS}
			placeholder={placeholder}
			class={`w-full resize-y leading-relaxed text-ctp-text ${BARE_INPUT} ${extra}`}
			onInput={(e) => onInput(e.currentTarget.value)}
		/>
	);
}

/**
 * 多行版：问卷里「一段话」这类题目用它；同样是「框 + 裸控件」。
 * `action` 跟单行版是同一个意思（行尾退回预设的 ×）——带预设的多行题也有自定义形态。
 */
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
