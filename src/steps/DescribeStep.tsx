import { BlockEditor } from '../components/BlockEditor';
import { Chip, Field, Panel, TextInput } from '../components/ui';
import { newBlock } from '../lib/card';
import { DEFAULT_FOOTER, DEFAULT_NOTICE_LABEL, NOTICE_TEMPLATES } from '../lib/config';
import type { CardData, Patch } from '../lib/types';

/** 描述：主体右栏的文本块 + 页脚 */
export function DescribeStep({ data, patch }: { data: CardData; patch: Patch }) {
	return (
		<>
			<Panel title="文本块">
				<BlockEditor blocks={data.blocks} onChange={(blocks) => patch({ blocks })} />

				<p class="mb-2 mt-5 text-base text-ctp-subtext0">常用说明，点击追加</p>
				<div class="flex flex-wrap gap-2">
					{NOTICE_TEMPLATES.map((template) => (
						<Chip
							key={template.id}
							onClick={() =>
								patch({ blocks: [...data.blocks, newBlock(DEFAULT_NOTICE_LABEL, template.text)] })
							}
						>
							＋ {template.label}
						</Chip>
					))}
				</div>
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
