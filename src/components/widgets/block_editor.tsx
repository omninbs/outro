import { AddButton, BARE_INPUT, BareTextArea, BOX, IconButton, RISE } from '../ui';

// 一块文本：本组件只认这个形状，内容层怎么定义与它无关
interface Block {
	id: string;
	label: string;
	text: string;
}

// 一块文本的长相：框里竖着排小标题与正文，窄屏贴边
const BLOCK_SHELL =
	`${BOX} flex flex-col gap-1 p-2 narrow:rounded-none narrow:border-x-0 ` +
	`narrow:px-inset ${RISE}`;

// 文本块编辑器：每块一条小标题（可留空）配一段正文
export function BlockEditor({
	blocks,
	on_change,
	create,
	copy,
}: {
	blocks: Block[];
	on_change: (blocks: Block[]) => void;
	create: () => Block;
	copy: { label: string; text: string; empty: string; add: string };
}) {
	// 改一块：用新值盖住那块，列表其余不动
	const replace = (id: string, next: Partial<Block>) =>
		on_change(blocks.map((block) => (block.id === id ? { ...block, ...next } : block)));
	const remove = (id: string) => on_change(blocks.filter((block) => block.id !== id));
	const add = () => on_change([...blocks, create()]);
	// 空着才算空态：那行说明只在没内容时出现
	const empty = blocks.length === 0 ? copy.empty : undefined;

	return (
		<div class="flex flex-col gap-3">
			{blocks.map((block) => (
				<div key={block.id} class={BLOCK_SHELL}>
					<div class="flex items-center gap-2">
						<input
							type="text"
							value={block.label}
							placeholder={copy.label}
							class={`min-w-0 flex-1 font-medium text-ctp-mauve ${BARE_INPUT}`}
							onInput={(e) => replace(block.id, { label: e.currentTarget.value })}
						/>
						<IconButton label="删除" on_click={() => remove(block.id)} />
					</div>
					<BareTextArea
						value={block.text}
						placeholder={copy.text}
						on_input={(text) => replace(block.id, { text })}
					/>
				</div>
			))}

			<AddButton empty={empty} on_click={add}>
				{copy.add}
			</AddButton>
		</div>
	);
}
