import type { ComponentChildren } from 'preact';

/** 表单控件的统一外观 */
const INPUT =
	'w-full rounded-md border border-ctp-surface1 bg-ctp-crust px-3 py-2 text-base text-ctp-text ' +
	'placeholder:text-ctp-overlay0 focus:border-ctp-mauve focus:outline-none';

/**
 * 编辑器里「裸」控件的外观：无边框无底色，撑在卡片上。
 * 宽度、flex 之类由调用方补，所以导出常量而不是组件。
 */
export const BARE_INPUT =
	'rounded border-none bg-transparent px-2 py-1.5 text-base ' +
	'placeholder:text-ctp-overlay0 focus:outline-none';

export function TextInput({
	value,
	onInput,
	placeholder,
	class: cls,
}: {
	value: string;
	onInput: (value: string) => void;
	placeholder?: string;
	class?: string;
}) {
	return (
		<input
			type="text"
			value={value}
			placeholder={placeholder}
			class={`${INPUT} ${cls ?? ''}`}
			onInput={(e) => onInput(e.currentTarget.value)}
		/>
	);
}

/** 多行版：问卷里「一段话」这类题目用它，纵向下拉可调 */
export function TextArea({
	value,
	onInput,
	placeholder,
	rows = 5,
	class: cls,
}: {
	value: string;
	onInput: (value: string) => void;
	placeholder?: string;
	rows?: number;
	class?: string;
}) {
	return (
		<textarea
			value={value}
			rows={rows}
			placeholder={placeholder}
			class={`${INPUT} resize-y leading-relaxed ${cls ?? ''}`}
			onInput={(e) => onInput(e.currentTarget.value)}
		/>
	);
}

/**
 * 一行裸控件的外框：crust 底、一圈描边，里面的控件用 `BARE_INPUT` 不带边框。
 *
 * 元数据那一行、问卷里「自己写」那个框都用它——「右边嵌着 × 的输入框」
 * 只有一个定义，两处的内边距、描边、圆角就不会各自漂移。
 * 块编辑器的外框不用它：那里一层框里还套着正文，× 跟小标题同一行，是另一种形状。
 *
 * 内边距是照高度凑的：裸输入框 24px 行高 + `py-1.5` 上下各 6px = 36px，
 * 再上下各 2px、加描边 2px，正好 42px——跟 `TextInput`（`py-2` + 描边）一般高。
 * 左右 4px 加裸输入框自己的 `px-2`，文字起点也正好是 `TextInput` 的 `px-3`。
 */
export function BareRow({ children, action }: { children: ComponentChildren; action?: ComponentChildren }) {
	return (
		<div class="flex items-center gap-2 rounded-md border border-ctp-surface0 bg-ctp-crust px-1 py-0.5">
			{children}
			{action}
		</div>
	);
}
