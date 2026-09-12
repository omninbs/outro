import { BARE_INPUT, BareRow, IconButton } from '../ui';

// 一行键值对：名称与内容并排（窄屏上下），行尾的删除是这一行自带的动作
export function KeyValueRow({
	label,
	value,
	labelPlaceholder,
	valuePlaceholder,
	onLabelChange,
	onValueChange,
	onRemove,
}: {
	label: string;
	value: string;
	labelPlaceholder: string;
	valuePlaceholder: string;
	onLabelChange: (label: string) => void;
	onValueChange: (value: string) => void;
	onRemove: () => void;
}) {
	return (
		<BareRow action={<IconButton label="删除" onClick={onRemove} />}>
			<div class="flex min-w-0 flex-1 items-center gap-2 narrow:flex-col narrow:items-stretch">
				<input
					type="text"
					value={label}
					placeholder={labelPlaceholder}
					class={`w-36 shrink-0 font-medium text-ctp-mauve narrow:w-full ${BARE_INPUT}`}
					onInput={(e) => onLabelChange(e.currentTarget.value)}
				/>
				<input
					type="text"
					value={value}
					placeholder={valuePlaceholder}
					class={`min-w-0 flex-1 text-ctp-text narrow:w-full narrow:flex-none ${BARE_INPUT}`}
					onInput={(e) => onValueChange(e.currentTarget.value)}
				/>
			</div>
		</BareRow>
	);
}
