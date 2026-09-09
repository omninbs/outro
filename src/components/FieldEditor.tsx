import type { Field } from '../lib/types';

const newId = () => `f${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export function newField(label = '', value = ''): Field {
	return { id: newId(), label, value };
}

export function FieldEditor({
	fields,
	onChange,
}: {
	fields: Field[];
	onChange: (fields: Field[]) => void;
}) {
	const update = (id: string, patch: Partial<Field>) =>
		onChange(fields.map((f) => (f.id === id ? { ...f, ...patch } : f)));

	const remove = (id: string) => onChange(fields.filter((f) => f.id !== id));

	return (
		<div class="space-y-2">
			{fields.length === 0 && (
				<p class="rounded-md border border-dashed border-ctp-surface1 px-3 py-4 text-center text-xs text-ctp-overlay0">
					还没有字段，点下方按钮添加
				</p>
			)}

			{fields.map((field) => (
				<div
					key={field.id}
					class="flex items-center gap-2 rounded-md border border-ctp-surface0 bg-ctp-crust p-1.5"
				>
					<input
						type="text"
						value={field.label}
						placeholder="字段名"
						class="w-32 shrink-0 rounded border-none bg-transparent px-2 py-1.5 text-sm font-medium text-ctp-mauve placeholder:text-ctp-overlay0 focus:outline-none"
						onInput={(e) => update(field.id, { label: e.currentTarget.value })}
					/>
					<input
						type="text"
						value={field.value}
						placeholder="填写内容"
						class="min-w-0 flex-1 rounded border-none bg-transparent px-2 py-1.5 text-sm text-ctp-text placeholder:text-ctp-overlay0 focus:outline-none"
						onInput={(e) => update(field.id, { value: e.currentTarget.value })}
					/>
					<button
						type="button"
						title="删除字段"
						onClick={() => remove(field.id)}
						class="grid h-7 w-7 shrink-0 place-items-center rounded text-ctp-overlay0 transition hover:bg-ctp-surface0 hover:text-ctp-red"
					>
						×
					</button>
				</div>
			))}

			<button
				type="button"
				onClick={() => onChange([...fields, newField()])}
				class="w-full rounded-md border border-dashed border-ctp-surface1 py-2 text-sm text-ctp-subtext0 transition hover:border-ctp-mauve hover:text-ctp-mauve"
			>
				＋ 添加字段
			</button>
		</div>
	);
}
