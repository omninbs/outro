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
		/* 清单自己就是查询容器：一行放不放得下，取决于这一栏有多宽——两栏布局里窗口再宽，
		   分给表单的那一栏也可能很窄，所以问它自己，不问窗口。 */
		<div class="@container space-y-2">
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
					{/* 宽了就并排，窄了就上下排：名称框固定 144px 不让位，值那栏在窄容器里只剩几十像素，
					    与其硬撑不如换行。384px 是这条线——并排时值还有 178px 可用，比它窄就改成名称一行、值一行。
					    名称与值都在同一个 BareRow 里、× 在右边纵向居中，所以「一条元数据 = 一个框」没变。 */}
					<div class="flex min-w-0 flex-1 items-center gap-2 @max-sm:flex-col @max-sm:items-stretch">
						<input
							type="text"
							value={item.label}
							placeholder={COPY.field.metaLabel}
							class={`w-36 shrink-0 font-medium text-ctp-mauve @max-sm:w-full ${BARE_INPUT}`}
							onInput={(e) => onChange(updateById(items, item.id, { label: e.currentTarget.value }))}
						/>
						{/* 上下排时 flex-1 管的是「竖着分」，会把值压成零高，所以窄容器里换成 flex-none 交给宽度定 */}
						<input
							type="text"
							value={item.value}
							placeholder={COPY.field.metaValue}
							class={`min-w-0 flex-1 text-ctp-text @max-sm:w-full @max-sm:flex-none ${BARE_INPUT}`}
							onInput={(e) => onChange(updateById(items, item.id, { value: e.currentTarget.value }))}
						/>
					</div>
				</BareRow>
			))}

			<AddButton onClick={() => onChange([...items, newMetaItem()])}>{COPY.action.addMeta}</AddButton>
		</div>
	);
}
