import { MetaEditor } from '../components/widgets/MetaEditor';
import { Field, Panel, TextInput } from '../components/ui';
import { newMetaItem } from '../lib/card';
import { COPY } from '../lib/copy';
import type { CardData, Patch } from '../lib/types';

// 摘要：内容的头部——标题与元数据；文本块与页脚归「描述」那一步
export function SummaryStep({ data, patch }: { data: CardData; patch: Patch }) {
	return (
		<>
			<Panel title={COPY.section.title}>
				<Field label={COPY.field.title}>
					<TextInput
						value={data.title}
						onInput={(title) => patch({ title })}
						placeholder={COPY.placeholder}
					/>
				</Field>
			</Panel>

			<Panel title={COPY.section.meta}>
				<MetaEditor
					items={data.meta}
					onChange={(meta) => patch({ meta })}
					create={newMetaItem}
					copy={{
						label: COPY.field.metaLabel,
						value: COPY.field.metaValue,
						empty: COPY.emptyMeta,
						add: COPY.action.addMeta,
					}}
				/>
			</Panel>
		</>
	);
}
