import { newMetaItem, removeById, updateById } from '../lib/card';
import { COPY } from '../lib/copy';
import type { MetaItem } from '../lib/types';
import { AddButton, BARE_INPUT, BareRow, EmptyHint, IconButton } from './ui';

/** 元数据编辑器：一行一条「名称 + 内容」，名称就是最终页上那一行的标签 */
export function MetaEditor({
	items,
	onChange,
}: {
	items: MetaItem[];
	onChange: (items: MetaItem[]) => void;
}) {
	return (
		<div class="flex flex-col gap-2">
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
					{/* 窄屏上下排：名称框固定 144px 且不让位，跟值硬挤在一行里，值那栏就只剩几十像素。
					    窄屏本来就是一条竖着的流，名称一行、值一行反而顺；× 在右边纵向居中，
					    所以「一条元数据 = 一个框」这件事没变。 */}
					<div class="flex min-w-0 flex-1 items-center gap-2 max-narrow:flex-col max-narrow:items-stretch">
						<input
							type="text"
							value={item.label}
							placeholder={COPY.field.metaLabel}
							class={`w-36 shrink-0 font-medium text-ctp-mauve max-narrow:w-full ${BARE_INPUT}`}
							onInput={(e) => onChange(updateById(items, item.id, { label: e.currentTarget.value }))}
						/>
						{/* 上下排时 flex-1 管的是「竖着分」，会把值压成零高，所以窄屏换成 flex-none 交给宽度定 */}
						<input
							type="text"
							value={item.value}
							placeholder={COPY.field.metaValue}
							class={`min-w-0 flex-1 text-ctp-text max-narrow:w-full max-narrow:flex-none ${BARE_INPUT}`}
							onInput={(e) => onChange(updateById(items, item.id, { value: e.currentTarget.value }))}
						/>
					</div>
				</BareRow>
			))}

			<AddButton onClick={() => onChange([...items, newMetaItem()])}>{COPY.action.addMeta}</AddButton>
		</div>
	);
}
