import { newMetaItem, removeById, updateById } from '../lib/card';
import { COPY } from '../lib/copy';
import type { MetaItem } from '../lib/types';
import { AddButton, BARE_INPUT, BareRow, EmptyHint, IconButton } from './ui';

// 元数据编辑器：一条一行「名称 + 内容」，名称就是最终页那条的标签
export function MetaEditor({
	items,
	onChange,
}: {
	items: MetaItem[];
	onChange: (items: MetaItem[]) => void;
}) {
	return (
		<div class="flex flex-col gap-2">
			{items.length === 0 && <EmptyHint>{COPY.emptyMeta}</EmptyHint>}

			{items.map((item) => (
				<BareRow
					key={item.id}
					action={
						<IconButton label={COPY.action.remove} onClick={() => onChange(removeById(items, item.id))} />
					}
				>
					<div class="flex min-w-0 flex-1 items-center gap-2 narrow:flex-col narrow:items-stretch">
						<input
							type="text"
							value={item.label}
							placeholder={COPY.field.metaLabel}
							class={`w-36 shrink-0 font-medium text-ctp-mauve narrow:w-full ${BARE_INPUT}`}
							onInput={(e) => onChange(updateById(items, item.id, { label: e.currentTarget.value }))}
						/>
						<input
							type="text"
							value={item.value}
							placeholder={COPY.field.metaValue}
							class={`min-w-0 flex-1 text-ctp-text narrow:w-full narrow:flex-none ${BARE_INPUT}`}
							onInput={(e) => onChange(updateById(items, item.id, { value: e.currentTarget.value }))}
						/>
					</div>
				</BareRow>
			))}

			<AddButton onClick={() => onChange([...items, newMetaItem()])}>{COPY.action.addMeta}</AddButton>
		</div>
	);
}
