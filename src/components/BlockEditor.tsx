import { newBlock, removeById, updateById } from '../lib/card';
import { COPY } from '../lib/copy';
import type { TextBlock } from '../lib/types';
import { AddButton, BARE_INPUT, BareTextArea, BOX, EmptyHint, IconButton, RISE } from './ui';

/** 文本块编辑器：每块一条小标题（可留空）配一段正文 */
export function BlockEditor({
	blocks,
	onChange,
}: {
	blocks: TextBlock[];
	onChange: (blocks: TextBlock[]) => void;
}) {
	return (
		<div class="flex flex-col gap-3">
			{blocks.length === 0 && <EmptyHint>还没有文本块，点下方按钮添加</EmptyHint>}

			{blocks.map((block) => (
				/* 窄屏跟别的整行一个待遇：横向贴边、去掉侧边描边，横向留白自己带一次 */
				<div
					key={block.id}
					class={`${BOX} p-2 narrow:rounded-none narrow:border-x-0 narrow:px-inset ${RISE}`}
				>
					<div class="flex items-center gap-2">
						<input
							type="text"
							value={block.label}
							placeholder={COPY.field.blockLabel}
							class={`min-w-0 flex-1 font-medium text-ctp-mauve ${BARE_INPUT}`}
							onInput={(e) => onChange(updateById(blocks, block.id, { label: e.currentTarget.value }))}
						/>
						<IconButton title={COPY.action.remove} onClick={() => onChange(removeById(blocks, block.id))} />
					</div>
					<BareTextArea
						value={block.text}
						placeholder={COPY.field.blockText}
						class="mt-1"
						onInput={(text) => onChange(updateById(blocks, block.id, { text }))}
					/>
				</div>
			))}

			<AddButton onClick={() => onChange([...blocks, newBlock()])}>{COPY.action.addBlock}</AddButton>
		</div>
	);
}
