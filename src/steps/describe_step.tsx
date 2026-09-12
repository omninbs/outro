import { BlockEditor } from '../components/widgets/block_editor';
import { Field, Panel, TextInput } from '../components/ui';
import { new_block } from '../lib/card';
import { COPY } from '../lib/copy';
import type { CardData, Patch } from '../lib/types';

// 描述：内容的尾部——文本块与页脚
export function DescribeStep({ data, patch }: { data: CardData; patch: Patch }) {
	return (
		<>
			<Panel title={COPY.section.blocks}>
				<BlockEditor
					blocks={data.blocks}
					on_change={(blocks) => patch({ blocks })}
					create={new_block}
					copy={{
						label: COPY.field.block_label,
						text: COPY.field.block_text,
						add: COPY.action.add_block,
					}}
				/>
			</Panel>

			<Panel title={COPY.section.footer}>
				<Field label={COPY.field.footer_text}>
					<TextInput
						value={data.footer_text}
						on_input={(footer_text) => patch({ footer_text })}
						placeholder={COPY.placeholder}
					/>
				</Field>
			</Panel>
		</>
	);
}
