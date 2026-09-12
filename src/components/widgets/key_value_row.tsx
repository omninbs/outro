import { BARE_INPUT, BareRow, IconButton } from '../ui';

// 一行键值对：名称与内容并排（窄屏上下），行尾的删除是这一行自带的动作
export function KeyValueRow({
	label,
	value,
	label_placeholder,
	value_placeholder,
	on_label_change,
	on_value_change,
	on_remove,
}: {
	label: string;
	value: string;
	label_placeholder: string;
	value_placeholder: string;
	on_label_change: (label: string) => void;
	on_value_change: (value: string) => void;
	on_remove: () => void;
}) {
	return (
		<BareRow action={<IconButton label="删除" on_click={on_remove} />}>
			<div class="flex min-w-0 flex-1 items-center gap-2 narrow:flex-col narrow:items-stretch">
				<input
					type="text"
					value={label}
					placeholder={label_placeholder}
					class={`w-36 shrink-0 font-medium text-ctp-mauve narrow:w-full ${BARE_INPUT}`}
					onInput={(e) => on_label_change(e.currentTarget.value)}
				/>
				<input
					type="text"
					value={value}
					placeholder={value_placeholder}
					class={`min-w-0 flex-1 text-ctp-text narrow:w-full narrow:flex-none ${BARE_INPUT}`}
					onInput={(e) => on_value_change(e.currentTarget.value)}
				/>
			</div>
		</BareRow>
	);
}
