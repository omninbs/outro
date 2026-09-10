import { MetaEditor } from '../components/MetaEditor';
import { Field, Panel, TextInput } from '../components/ui';
import { DEFAULT_TITLE } from '../lib/config';
import type { CardData, Patch } from '../lib/types';

/** 摘要：页面标题 + 主体左栏的元数据 */
export function SummaryStep({ data, patch }: { data: CardData; patch: Patch }) {
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
			</Panel>
		</>
	);
}
