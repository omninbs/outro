import { newId } from '../lib/id';
import type { TextBlock } from '../lib/types';

export const newBlock = (label = '', text = ''): TextBlock => ({
	id: newId('b'),
	label,
	text,
});

export function BlockEditor({
	blocks,
	onChange,
}: {
	blocks: TextBlock[];
	onChange: (blocks: TextBlock[]) => void;
}) {
	const update = (id: string, patch: Partial<TextBlock>) =>
		onChange(blocks.map((block) => (block.id === id ? { ...block, ...patch } : block)));

	const remove = (id: string) => onChange(blocks.filter((block) => block.id !== id));

	return (
		<div class="space-y-3">
			{blocks.length === 0 && (
				<p class="rounded-md border border-dashed border-ctp-surface1 px-3 py-4 text-center text-base text-ctp-overlay0">
					还没有文本块，点下方按钮添加
				</p>
			)}

			{blocks.map((block) => (
				<div key={block.id} class="rounded-md border border-ctp-surface0 bg-ctp-crust p-2">
					<div class="flex items-center gap-2">
						<input
							type="text"
							value={block.label}
							placeholder="小标题（可留空）"
							class="min-w-0 flex-1 rounded border-none bg-transparent px-2 py-1.5 text-base font-medium text-ctp-mauve placeholder:text-ctp-overlay0 focus:outline-none"
							onInput={(e) => update(block.id, { label: e.currentTarget.value })}
						/>
						<button
							type="button"
							title="删除"
							onClick={() => remove(block.id)}
							class="grid h-8 w-8 shrink-0 place-items-center rounded text-ctp-overlay0 transition hover:bg-ctp-surface0 hover:text-ctp-red"
						>
							×
						</button>
					</div>
					<textarea
						value={block.text}
						rows={5}
						placeholder="正文，例如版权声明"
						class="mt-1 w-full resize-y rounded border-none bg-transparent px-2 py-1.5 text-base leading-relaxed text-ctp-text placeholder:text-ctp-overlay0 focus:outline-none"
						onInput={(e) => update(block.id, { text: e.currentTarget.value })}
					/>
				</div>
			))}

			<button
				type="button"
				onClick={() => onChange([...blocks, newBlock()])}
				class="w-full rounded-md border border-dashed border-ctp-surface1 py-2 text-base text-ctp-subtext0 transition hover:border-ctp-mauve hover:text-ctp-mauve"
			>
				＋ 添加文本块
			</button>
		</div>
	);
}
