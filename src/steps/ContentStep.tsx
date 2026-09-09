import { FieldEditor, newField } from '../components/FieldEditor';
import { Field, Panel, TextInput } from '../components/ui';
import { QUICK_FIELDS } from '../lib/config';
import type { CardData } from '../lib/types';

export function ContentStep({
	data,
	patch,
}: {
	data: CardData;
	patch: (next: Partial<CardData>) => void;
}) {
	const hasQuick = (label: string) => data.fields.some((f) => f.label.trim() === label);

	return (
		<>
			<Panel title="卡片标题">
				<Field label="标题" hint="显示在卡片最上方，通常是「歌曲信息」这类总起">
					<TextInput
						value={data.title}
						onInput={(title) => patch({ title })}
						placeholder="歌曲信息"
					/>
				</Field>
			</Panel>

			<Panel title="元信息字段">
				<FieldEditor fields={data.fields} onChange={(fields) => patch({ fields })} />

				<p class="mb-2 mt-5 text-xs text-ctp-subtext0">常用字段，点击追加</p>
				<div class="flex flex-wrap gap-2">
					{QUICK_FIELDS.map((quick) => {
						const added = hasQuick(quick.label);
						return (
							<button
								key={quick.label}
								type="button"
								disabled={added}
								onClick={() => patch({ fields: [...data.fields, newField(quick.label)] })}
								class={`rounded-full border px-3 py-1 text-xs transition ${
									added
										? 'border-ctp-green/40 text-ctp-green'
										: 'border-ctp-surface1 text-ctp-subtext0 hover:border-ctp-mauve hover:text-ctp-mauve'
								}`}
							>
								{added ? '✓ ' : '＋ '}
								{quick.label}
							</button>
						);
					})}
				</div>
			</Panel>
		</>
	);
}
