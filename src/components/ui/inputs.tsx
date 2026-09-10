import type { ComponentChildren } from 'preact';

/**
 * 裸控件的外观：无边框、无底色，撑在框里。
 * 宽度、flex、文字色由调用方补，所以导出常量而不是组件。
 */
export const BARE_INPUT =
	'rounded border-none bg-transparent px-2 py-1.5 text-base ' +
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
 */
export function BareRow({ children, action }: { children: ComponentChildren; action?: ComponentChildren }) {
	return (
		<div class={`${BOX} flex items-center gap-2 p-1.5 focus-within:border-ctp-mauve`}>
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

/** 多行版：问卷里「一段话」这类题目用它，纵向下拉可调；同样是「框 + 裸控件」 */
export function TextArea({
	value,
	onInput,
	placeholder,
	rows = 5,
}: {
	value: string;
	onInput: (value: string) => void;
	placeholder?: string;
	rows?: number;
}) {
	return (
		<BareRow>
			<textarea
				value={value}
				rows={rows}
				placeholder={placeholder}
				class={`w-full resize-y leading-relaxed text-ctp-text ${BARE_INPUT}`}
				onInput={(e) => onInput(e.currentTarget.value)}
			/>
		</BareRow>
	);
}
