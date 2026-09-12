import { BlockEditor } from '../components/widgets/BlockEditor';
import { Field, Panel, TextInput } from '../components/ui';
import { COPY } from '../lib/copy';
import type { CardData, Patch } from '../lib/types';

// 描述：内容的尾部——文本块与页脚
export function DescribeStep({ data, patch }: { data: CardData; patch: Patch }) {
	return (
		<>
			<Panel title={COPY.section.blocks}>
				<BlockEditor blocks={data.blocks} onChange={(blocks) => patch({ blocks })} />
			</Panel>

			<Panel title={COPY.section.footer}>
				<Field label={COPY.field.footerText}>
					<TextInput
						value={data.footerText}
						onInput={(footerText) => patch({ footerText })}
						placeholder={COPY.placeholder}
					/>
				</Field>
			</Panel>
		</>
	);
}
