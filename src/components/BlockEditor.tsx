import { newBlock, removeById, updateById } from '../lib/card';
import { COPY } from '../lib/copy';
import type { TextBlock } from '../lib/types';
import { AddButton, BARE_INPUT, BOX, EmptyHint, IconButton } from './ui';

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
				/* 窄屏跟 BareRow 一个待遇：横向贴边、去侧边描边与圆角，横向留白自己带一次 */
				<div
					key={block.id}
					class={`${BOX} p-2 max-narrow:rounded-none max-narrow:border-x-0 max-narrow:px-inset`}
				>
					<div class="flex items-center gap-2">
						<input
							type="text"
							value={block.label}
							placeholder={COPY.field.blockLabel}
							class={`min-w-0 flex-1 font-medium text-ctp-mauve ${BARE_INPUT}`}
							onInput={(e) => onChange(updateById(blocks, block.id, { label: e.currentTarget.value }))}
						/>
						<IconButton title={COPY.action.remove} onClick={() => onChange(removeById(blocks, block.id))}>
							×
						</IconButton>
					</div>
					<textarea
						value={block.text}
						rows={5}
						placeholder={COPY.field.blockText}
						class={`mt-1 w-full resize-y leading-relaxed text-ctp-text ${BARE_INPUT}`}
						onInput={(e) => onChange(updateById(blocks, block.id, { text: e.currentTarget.value }))}
					/>
				</div>
			))}

			<AddButton onClick={() => onChange([...blocks, newBlock()])}>{COPY.action.addBlock}</AddButton>
		</div>
	);
}
