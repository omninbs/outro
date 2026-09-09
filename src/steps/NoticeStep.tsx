import { Field, Panel, Select, TextArea, TextInput } from '../components/ui';
import { NOTICE_TEMPLATES } from '../lib/config';
import type { CardData } from '../lib/types';

export function NoticeStep({
	data,
	patch,
}: {
	data: CardData;
	patch: (next: Partial<CardData>) => void;
}) {
	return (
		<>
			<Panel title="声明标题">
				<Field label="标题">
					<TextInput
						value={data.noticeLabel}
						onInput={(noticeLabel) => patch({ noticeLabel })}
						placeholder="版权声明"
					/>
				</Field>
			</Panel>

			<Panel title="声明内容">
				<Field label="套用模板" hint="选择后可以继续自由修改">
					<Select
						value=""
						options={[
							{ value: '', label: '—— 选择模板 ——' },
							...NOTICE_TEMPLATES.map((t) => ({ value: t.id, label: t.label })),
						]}
						onChange={(id) => {
							const hit = NOTICE_TEMPLATES.find((t) => t.id === id);
							if (hit) patch({ notice: hit.text });
						}}
					/>
				</Field>

				<Field label="声明正文" hint="写清三件事：能否转载、能否商用、是否需注明出处">
					<TextArea
						value={data.notice}
						onInput={(notice) => patch({ notice })}
						rows={7}
					/>
				</Field>
			</Panel>
		</>
	);
}
