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
