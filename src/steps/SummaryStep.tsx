import { MetaEditor, newMetaItem } from '../components/MetaEditor';
import { Field, Panel, TextInput } from '../components/ui';
import { DEFAULT_TITLE, QUICK_META } from '../lib/config';
import type { CardData } from '../lib/types';

/** 摘要：页面标题 + 主体左栏的元数据 */
export function SummaryStep({
	data,
	patch,
}: {
	data: CardData;
	patch: (next: Partial<CardData>) => void;
}) {
	const hasQuick = (label: string) => data.meta.some((item) => item.label.trim() === label);

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
						const added = hasQuick(label);
						return (
							<button
								key={label}
								type="button"
								disabled={added}
								onClick={() => patch({ meta: [...data.meta, newMetaItem(label)] })}
								class={`rounded-full border px-3 py-1.5 text-base transition ${
									added
										? 'border-ctp-green/40 text-ctp-green'
										: 'border-ctp-surface1 text-ctp-subtext0 hover:border-ctp-mauve hover:text-ctp-mauve'
								}`}
							>
								{added ? '✓ ' : '＋ '}
								{label}
							</button>
						);
					})}
				</div>
			</Panel>
		</>
	);
}
