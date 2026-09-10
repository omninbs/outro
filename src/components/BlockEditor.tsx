import { newBlock, removeById, updateById } from '../lib/card';
import type { TextBlock } from '../lib/types';
import { AddButton, BARE_INPUT, EmptyHint, IconButton } from './ui';

/** 文本块编辑器：一行小标题（可留空）+ 一段正文 */
export function BlockEditor({
	blocks,
	onChange,
}: {
	blocks: TextBlock[];
	onChange: (blocks: TextBlock[]) => void;
}) {
	return (
		<div class="space-y-3">
			{blocks.length === 0 && <EmptyHint>还没有文本块，点下方按钮添加</EmptyHint>}

			{blocks.map((block) => (
				<div key={block.id} class="rounded-md border border-ctp-surface0 bg-ctp-crust p-2">
					<div class="flex items-center gap-2">
						<input
							type="text"
							value={block.label}
							placeholder="小标题（可留空）"
							class={`min-w-0 flex-1 font-medium text-ctp-mauve ${BARE_INPUT}`}
							onInput={(e) => onChange(updateById(blocks, block.id, { label: e.currentTarget.value }))}
						/>
						<IconButton title="删除" onClick={() => onChange(removeById(blocks, block.id))}>
							×
						</IconButton>
					</div>
					<textarea
						value={block.text}
						rows={5}
						placeholder="正文，例如版权声明"
						class={`mt-1 w-full resize-y leading-relaxed text-ctp-text ${BARE_INPUT}`}
						onInput={(e) => onChange(updateById(blocks, block.id, { text: e.currentTarget.value }))}
					/>
				</div>
			))}

			<AddButton onClick={() => onChange([...blocks, newBlock()])}>添加文本块</AddButton>
		</div>
	);
}
