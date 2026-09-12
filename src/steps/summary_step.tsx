import { MetaEditor } from '../components/widgets/meta_editor';
import { Field, Panel, TextInput } from '../components/ui';
import { new_meta_item } from '../lib/card';
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
						on_input={(title) => patch({ title })}
						placeholder={COPY.placeholder}
					/>
				</Field>
			</Panel>

			<Panel title={COPY.section.meta}>
				<MetaEditor
					items={data.meta}
					on_change={(meta) => patch({ meta })}
					create={new_meta_item}
					copy={{
						label: COPY.field.meta_label,
						value: COPY.field.meta_value,
						add: COPY.action.add_meta,
					}}
				/>
			</Panel>
		</>
	);
}
