import { AddButton } from '../ui';
import { KeyValueRow } from './KeyValueRow';

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
	copy: { label: string; value: string; add: string };
}) {
	return (
		<div class="flex flex-col gap-2">
			{items.map((item) => (
				<KeyValueRow
					key={item.id}
					label={item.label}
					value={item.value}
					label_placeholder={copy.label}
					value_placeholder={copy.value}
					on_label_change={(label) =>
						on_change(items.map((it) => (it.id === item.id ? { ...it, label } : it)))
					}
					on_value_change={(value) =>
						on_change(items.map((it) => (it.id === item.id ? { ...it, value } : it)))
					}
					on_remove={() => on_change(items.filter((it) => it.id !== item.id))}
				/>
			))}

			<AddButton is_empty={items.length === 0} on_click={() => on_change([...items, create()])}>
				{copy.add}
			</AddButton>
		</div>
	);
}
