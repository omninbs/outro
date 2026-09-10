import { MetaEditor } from '../components/MetaEditor';
import { Chip, Field, Panel, TextInput } from '../components/ui';
import { newMetaItem } from '../lib/card';
import { DEFAULT_TITLE, QUICK_META } from '../lib/config';
import type { CardData, Patch } from '../lib/types';

/** 摘要：页面标题 + 主体左栏的元数据 */
export function SummaryStep({ data, patch }: { data: CardData; patch: Patch }) {
	// 常用条目加没加，看的是它到底在不在列表里，而不是它有没有被点过
	const added = (label: string) => data.meta.some((item) => item.label.trim() === label);

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

				<p class="mb-2 mt-5 text-base text-ctp-subtext0">常用条目，点击追加</p>
				<div class="flex flex-wrap gap-2">
					{QUICK_META.map((label) => {
						const isAdded = added(label);
						return (
							<Chip
								key={label}
								tone={isAdded ? 'done' : 'plain'}
								disabled={isAdded}
								onClick={() => patch({ meta: [...data.meta, newMetaItem(label)] })}
							>
								{isAdded ? '✓ ' : '＋ '}
								{label}
							</Chip>
						);
					})}
				</div>
			</Panel>
		</>
	);
}
