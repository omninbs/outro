import { BlockEditor } from '../components/BlockEditor';
import { Field, Panel, TextInput } from '../components/ui';
import { DEFAULT_FOOTER } from '../lib/config';
import type { CardData, Patch } from '../lib/types';

/** 描述：主体右栏的文本块 + 页脚 */
export function DescribeStep({ data, patch }: { data: CardData; patch: Patch }) {
	return (
		<>
			<Panel title="文本块">
				<BlockEditor blocks={data.blocks} onChange={(blocks) => patch({ blocks })} />
			</Panel>

			<Panel title="页脚">
				<Field label="页脚文字">
					<TextInput
						value={data.footerText}
						onInput={(footerText) => patch({ footerText })}
						placeholder={DEFAULT_FOOTER}
					/>
				</Field>
			</Panel>
		</>
	);
}
