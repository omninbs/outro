import { newMetaItem, removeById, updateById } from '../lib/card';
import { COPY } from '../lib/copy';
import type { MetaItem } from '../lib/types';
import { AddButton, BARE_INPUT, BareRow, EmptyHint, IconButton } from './ui';

/** 元数据编辑器：一行一条「名称 + 内容」，名称就是最终页左栏的标签 */
export function MetaEditor({
	items,
	onChange,
}: {
	items: MetaItem[];
	onChange: (items: MetaItem[]) => void;
}) {
	return (
		<div class="space-y-2">
			{items.length === 0 && <EmptyHint>还没有元数据，点下方按钮添加</EmptyHint>}

			{items.map((item) => (
				<BareRow
					key={item.id}
					action={
						<IconButton title={COPY.action.remove} onClick={() => onChange(removeById(items, item.id))}>
							×
						</IconButton>
					}
				>
					<input
						type="text"
						value={item.label}
						placeholder={COPY.field.metaLabel}
						class={`w-36 shrink-0 font-medium text-ctp-mauve ${BARE_INPUT}`}
						onInput={(e) => onChange(updateById(items, item.id, { label: e.currentTarget.value }))}
					/>
					<input
						type="text"
						value={item.value}
						placeholder={COPY.field.metaValue}
						class={`min-w-0 flex-1 text-ctp-text ${BARE_INPUT}`}
						onInput={(e) => onChange(updateById(items, item.id, { value: e.currentTarget.value }))}
					/>
				</BareRow>
			))}

			<AddButton onClick={() => onChange([...items, newMetaItem()])}>{COPY.action.addMeta}</AddButton>
		</div>
	);
}
