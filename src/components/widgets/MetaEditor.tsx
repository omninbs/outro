import { AddButton, BARE_INPUT, BareRow, EmptyHint, IconButton } from '../ui';

// 一行元数据：本组件只认这个形状，内容层怎么定义与它无关
interface Row {
	id: string;
	label: string;
	value: string;
}

// 元数据编辑器：一条一行「名称 + 内容」，名称就是最终页那条的标签
export function MetaEditor({
	items,
	onChange,
	create,
	copy,
}: {
	items: Row[];
	onChange: (items: Row[]) => void;
	create: () => Row;
	copy: { label: string; value: string; empty: string; add: string };
}) {
	return (
		<div class="flex flex-col gap-2">
			{items.length === 0 && <EmptyHint>{copy.empty}</EmptyHint>}

			{items.map((item) => (
				<BareRow
					key={item.id}
					action={
						<IconButton
							label="删除"
							onClick={() => onChange(items.filter((it) => it.id !== item.id))}
						/>
					}
				>
					<div class="flex min-w-0 flex-1 items-center gap-2 narrow:flex-col narrow:items-stretch">
						<input
							type="text"
							value={item.label}
							placeholder={copy.label}
							class={`w-36 shrink-0 font-medium text-ctp-mauve narrow:w-full ${BARE_INPUT}`}
							onInput={(e) =>
								onChange(
									items.map((it) =>
										it.id === item.id ? { ...it, label: e.currentTarget.value } : it,
									),
								)
							}
						/>
						<input
							type="text"
							value={item.value}
							placeholder={copy.value}
							class={`min-w-0 flex-1 text-ctp-text narrow:w-full narrow:flex-none ${BARE_INPUT}`}
							onInput={(e) =>
								onChange(
									items.map((it) =>
										it.id === item.id ? { ...it, value: e.currentTarget.value } : it,
									),
								)
							}
						/>
					</div>
				</BareRow>
			))}

			<AddButton onClick={() => onChange([...items, create()])}>{copy.add}</AddButton>
		</div>
	);
}
