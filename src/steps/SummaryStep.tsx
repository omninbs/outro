import { MetaEditor } from '../components/MetaEditor';
import { Chip, Field, Panel, TextInput } from '../components/ui';
import { newMetaItem } from '../lib/card';
import { DEFAULT_META_LABELS, DEFAULT_TITLE } from '../lib/config';
import type { CardData, Patch } from '../lib/types';

/** 摘要：页面标题 + 主体左栏的元数据 */
export function SummaryStep({ data, patch }: { data: CardData; patch: Patch }) {
	// 常用条目默认都在，所以这一排只在被删掉之后才出现
	const missing = DEFAULT_META_LABELS.filter(
		(label) => !data.meta.some((item) => item.label.trim() === label),
	);

	return (
		<>
			<Panel title="页面标题">
				<Field label="标题">
					<TextInput
						value={data.title}
						onInput={(title) => patch({ title })}
						placeholder={DEFAULT_TITLE}
					/>
				</Field>
			</Panel>

			<Panel title="元数据">
				<MetaEditor items={data.meta} onChange={(meta) => patch({ meta })} />

				{missing.length > 0 && (
					<>
						<p class="mb-2 mt-5 text-base text-ctp-subtext0">常用条目，点击追加</p>
						<div class="flex flex-wrap gap-2">
							{missing.map((label) => (
								<Chip
									key={label}
									onClick={() => patch({ meta: [...data.meta, newMetaItem(label)] })}
								>
									＋ {label}
								</Chip>
							))}
						</div>
					</>
				)}
			</Panel>
		</>
	);
}
