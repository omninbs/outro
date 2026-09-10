import { newId } from '../lib/id';
import type { MetaItem } from '../lib/types';

export const newMetaItem = (label = '', value = ''): MetaItem => ({
	id: newId('m'),
	label,
	value,
});

export function MetaEditor({
	items,
	onChange,
}: {
	items: MetaItem[];
	onChange: (items: MetaItem[]) => void;
}) {
	const update = (id: string, patch: Partial<MetaItem>) =>
		onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

	const remove = (id: string) => onChange(items.filter((item) => item.id !== id));

	return (
		<div class="space-y-2">
			{items.length === 0 && (
				<p class="rounded-md border border-dashed border-ctp-surface1 px-3 py-4 text-center text-base text-ctp-overlay0">
					还没有元数据，点下方按钮添加
				</p>
			)}

			{items.map((item) => (
				<div
					key={item.id}
					class="flex items-center gap-2 rounded-md border border-ctp-surface0 bg-ctp-crust p-1.5"
				>
					<input
						type="text"
						value={item.label}
						placeholder="名称"
						class="w-36 shrink-0 rounded border-none bg-transparent px-2 py-1.5 text-base font-medium text-ctp-mauve placeholder:text-ctp-overlay0 focus:outline-none"
						onInput={(e) => update(item.id, { label: e.currentTarget.value })}
					/>
					<input
						type="text"
						value={item.value}
						placeholder="填写内容"
						class="min-w-0 flex-1 rounded border-none bg-transparent px-2 py-1.5 text-base text-ctp-text placeholder:text-ctp-overlay0 focus:outline-none"
						onInput={(e) => update(item.id, { value: e.currentTarget.value })}
					/>
					<button
						type="button"
						title="删除"
						onClick={() => remove(item.id)}
						class="grid h-8 w-8 shrink-0 place-items-center rounded text-ctp-overlay0 transition hover:bg-ctp-surface0 hover:text-ctp-red"
					>
						×
					</button>
				</div>
			))}

			<button
				type="button"
				onClick={() => onChange([...items, newMetaItem()])}
				class="w-full rounded-md border border-dashed border-ctp-surface1 py-2 text-base text-ctp-subtext0 transition hover:border-ctp-mauve hover:text-ctp-mauve"
			>
				＋ 添加元数据
			</button>
		</div>
	);
}
