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
			{items.map((item) => (
				<KeyValueRow
					key={item.id}
					label={item.label}
					value={item.value}
					labelPlaceholder={copy.label}
					valuePlaceholder={copy.value}
					onLabelChange={(label) =>
						onChange(items.map((it) => (it.id === item.id ? { ...it, label } : it)))
					}
					onValueChange={(value) =>
						onChange(items.map((it) => (it.id === item.id ? { ...it, value } : it)))
					}
					onRemove={() => onChange(items.filter((it) => it.id !== item.id))}
				/>
			))}

			<AddButton
				empty={items.length === 0 ? copy.empty : undefined}
				onClick={() => onChange([...items, create()])}
			>
				{copy.add}
			</AddButton>
		</div>
	);
}
