import { AddButton } from '../ui';
import { KeyValueRow } from './key_value_row';

// 一行元数据：本组件只认这个形状，内容层怎么定义与它无关
interface Row {
	id: string;
	label: string;
	value: string;
}

// 元数据编辑器：一条一行「名称 + 内容」，名称就是最终页那条的标签
export function MetaEditor({
	items,
	on_change,
	create,
	copy,
}: {
	items: Row[];
	on_change: (items: Row[]) => void;
	create: () => Row;
	copy: { label: string; value: string; empty: string; add: string };
}) {
	// 改一条：用新值盖住那条，列表其余不动
	const replace = (id: string, next: Partial<Row>) =>
		on_change(items.map((item) => (item.id === id ? { ...item, ...next } : item)));
	const remove = (id: string) => on_change(items.filter((item) => item.id !== id));
	const add = () => on_change([...items, create()]);
	// 空着才算空态：那行说明只在没内容时出现
	const empty = items.length === 0 ? copy.empty : undefined;

	return (
		<div class="flex flex-col gap-2">
			{items.map((item) => (
				<KeyValueRow
					key={item.id}
					label={item.label}
					value={item.value}
					label_placeholder={copy.label}
					value_placeholder={copy.value}
					on_label_change={(label) => replace(item.id, { label })}
					on_value_change={(value) => replace(item.id, { value })}
					on_remove={() => remove(item.id)}
				/>
			))}

			<AddButton empty={empty} on_click={add}>
				{copy.add}
			</AddButton>
		</div>
	);
}
