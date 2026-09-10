import { MetaEditor } from '../components/MetaEditor';
import { Field, Panel, TextInput } from '../components/ui';
import { COPY } from '../lib/copy';
import type { CardData, Patch } from '../lib/types';

/** 摘要：页面标题 + 主体左栏的元数据 */
export function SummaryStep({ data, patch }: { data: CardData; patch: Patch }) {
	return (
		<>
			<Panel title={COPY.section.title}>
				<Field label={COPY.field.title}>
					<TextInput
						value={data.title}
						onInput={(title) => patch({ title })}
						placeholder={COPY.fallback.title}
					/>
				</Field>
			</Panel>

			<Panel title={COPY.section.meta}>
				<MetaEditor items={data.meta} onChange={(meta) => patch({ meta })} />
			</Panel>
		</>
	);
}
