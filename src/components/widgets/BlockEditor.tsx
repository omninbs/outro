import { newBlock, removeById, updateById } from '../../lib/card';
import type { TextBlock } from '../../lib/types';
import { AddButton, BARE_INPUT, BareTextArea, BOX, EmptyHint, IconButton, RISE } from '../ui';

// 组件自带的文案：借给调用方的东西写在这里
const TEXT = {
	empty: '还没有文本块，点下方按钮添加',
	label: '小标题（可留空）',
	text: '正文',
	remove: '删除',
	add: '添加文本块',
};

// 文本块编辑器：每块一条小标题（可留空）配一段正文
export function BlockEditor({
	blocks,
	onChange,
}: {
	blocks: TextBlock[];
	onChange: (blocks: TextBlock[]) => void;
}) {
	return (
		<div class="flex flex-col gap-3">
			{blocks.length === 0 && <EmptyHint>{TEXT.empty}</EmptyHint>}

			{blocks.map((block) => (
				<div
					key={block.id}
					class={`${BOX} flex flex-col gap-1 p-2 narrow:rounded-none narrow:border-x-0 narrow:px-inset ${RISE}`}
				>
					<div class="flex items-center gap-2">
						<input
							type="text"
							value={block.label}
							placeholder={TEXT.label}
							class={`min-w-0 flex-1 font-medium text-ctp-mauve ${BARE_INPUT}`}
							onInput={(e) => onChange(updateById(blocks, block.id, { label: e.currentTarget.value }))}
						/>
						<IconButton label={TEXT.remove} onClick={() => onChange(removeById(blocks, block.id))} />
					</div>
					<BareTextArea
						value={block.text}
						placeholder={TEXT.text}
						onInput={(text) => onChange(updateById(blocks, block.id, { text }))}
					/>
				</div>
			))}

			<AddButton onClick={() => onChange([...blocks, newBlock()])}>{TEXT.add}</AddButton>
		</div>
	);
}
