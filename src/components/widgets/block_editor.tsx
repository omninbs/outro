import { AddButton, BARE_INPUT, BareTextArea, BOX, IconButton, RISE } from '../ui';

// 一块文本：本组件只认这个形状，内容层怎么定义与它无关
interface Block {
	id: string;
	label: string;
	text: string;
}

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
	copy: { label: string; text: string; add: string };
}) {
	return (
		<div class="flex flex-col gap-3">
			{blocks.map((block) => (
				<div
					key={block.id}
					class={`${BOX} flex flex-col gap-1 p-2 narrow:rounded-none narrow:border-x-0 narrow:px-inset ${RISE}`}
				>
					<div class="flex items-center gap-2">
						<input
							type="text"
							value={block.label}
							placeholder={copy.label}
							class={`min-w-0 flex-1 font-medium text-ctp-mauve ${BARE_INPUT}`}
							onInput={(e) =>
								on_change(
									blocks.map((it) =>
										it.id === block.id ? { ...it, label: e.currentTarget.value } : it,
									),
								)
							}
						/>
						<IconButton
							label="删除"
							on_click={() => on_change(blocks.filter((it) => it.id !== block.id))}
						/>
					</div>
					<BareTextArea
						value={block.text}
						placeholder={copy.text}
						on_input={(text) =>
							on_change(blocks.map((it) => (it.id === block.id ? { ...it, text } : it)))
						}
					/>
				</div>
			))}

			<AddButton is_empty={blocks.length === 0} on_click={() => on_change([...blocks, create()])}>
				{copy.add}
			</AddButton>
		</div>
	);
}
