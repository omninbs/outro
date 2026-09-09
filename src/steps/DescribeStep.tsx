import { BlockEditor, newBlock } from '../components/BlockEditor';
import { Field, Panel, TextInput } from '../components/ui';
import { DEFAULT_NOTICE_LABEL, NOTICE_TEMPLATES } from '../lib/config';
import type { CardData } from '../lib/types';

/** 描述：主体右栏的文本块 + 页脚 */
export function DescribeStep({
	data,
	patch,
}: {
	data: CardData;
	patch: (next: Partial<CardData>) => void;
}) {
	return (
		<>
			<Panel title="文本块">
				<BlockEditor blocks={data.blocks} onChange={(blocks) => patch({ blocks })} />

				<p class="mb-2 mt-5 text-xs text-ctp-subtext0">常用声明，点击追加</p>
				<div class="flex flex-wrap gap-2">
					{NOTICE_TEMPLATES.map((template) => (
						<button
							key={template.id}
							type="button"
							onClick={() =>
								patch({ blocks: [...data.blocks, newBlock(DEFAULT_NOTICE_LABEL, template.text)] })
							}
							class="rounded-full border border-ctp-surface1 px-3 py-1 text-xs text-ctp-subtext0 transition hover:border-ctp-mauve hover:text-ctp-mauve"
						>
							＋ {template.label}
						</button>
					))}
				</div>
			</Panel>

			<Panel title="页脚">
				<Field label="页脚文字" hint="始终显示在页面底部右侧，左侧是「编辑」链接">
					<TextInput
						value={data.footerText}
						onInput={(footerText) => patch({ footerText })}
						placeholder="由 kemiamu/colophon 生成"
					/>
				</Field>
			</Panel>
		</>
	);
}
