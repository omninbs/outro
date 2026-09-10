import type { ComponentChildren } from 'preact';

import { COPY } from '../lib/copy';
import { resolveOutro } from '../lib/outro';
import type { CardData } from '../lib/types';
import { Panel, SUB_TEXT, EmptyHint } from './ui';

/** 分组标题：摘要 / 描述 / 页脚。每组上面一条细线，第一组也不例外，免得跟面板标题粘在一起 */
const Group = ({ text, count, children }: { text: string; count: number; children: ComponentChildren }) => (
	<section class="border-t border-ctp-surface0 pt-5">
		{/* 窄屏卡片横向贴边，所以标题行也得自己带一次 inset，才跟下面的内容落在同一条竖线上
		    （那条分隔线不用管：它属于「面」，贴边是刻意的） */}
		<div class="mb-2 flex items-baseline justify-between gap-2 max-narrow:px-inset">
			<h3 class="text-base font-semibold tracking-wide text-ctp-subtext1">{text}</h3>
			<span class="text-base tabular-nums text-ctp-overlay0">{count}</span>
		</div>
		{children}
	</section>
);

/**
 * 摘要里的一行元数据，标题也是其中一行。
 *
 * 名称列固定 96px 且不让位——每一行都是独立的 flex，只有定宽才能让各行的名称对齐
 * （跟 `MetaEditor` 那个 `w-36` 是同一个道理）。**不截断**：名称写长了就换行，
 * 截断会丢字，而这是给人「最后确认」用的清单，宁可它高一点。
 *
 * 窄屏上下排（跟所有别处的元数据行一样）；这时 `flex-1` 管的是「竖着分」，
 * 会把值压成零高，所以窄屏换成 `flex-none` 交给宽度定。
 */
const Row = ({ label, value }: { label: string; value: string }) => (
	<div class="flex gap-3 text-base leading-relaxed max-narrow:flex-col max-narrow:gap-1">
		<dt class="w-24 shrink-0 text-ctp-subtext0 max-narrow:w-full">{label}</dt>
		<dd class="min-w-0 flex-1 break-words text-ctp-text max-narrow:flex-none">{value}</dd>
	</div>
);

/**
 * 清单：按填写步骤分成摘要、描述、页脚三组，内容一律取自最终的结尾页（resolveOutro），
 * 所见即最终页会印出来的东西——名称没写就空着，跟最终页一样，清单不自作主张补字。
 * 宽档（`wide:`）在表单旁边常驻；中档及以下没有那一条栏，
 * 改在第三步「生成」前显示一次，作最后的确认。
 * 哪一组空着就在那一组里放一个虚线提示（`COPY.empty`）：清单是预览，「空着」的后果
 * （结尾页上那块不印）得写出来，不能让人自己推。
 */
export function FilledList({ data }: { data: CardData }) {
	const { title, meta, blocks, footer } = resolveOutro(data);

	return (
		<Panel title={COPY.section.list}>
			{/* 窄屏卡片横向贴边、不给留白，所以**有内容**的每个分支各自带一次 inset；
			    没内容时换成 `EmptyHint`，那个框自己带（它就是框本身，再叠一层就窄一圈） */}
			<div class="flex flex-col gap-5">
				{/* 标题也能留空：没填就不印这一行，跟最终页一致 */}
				<Group text={COPY.step.summary} count={(title ? 1 : 0) + meta.length}>
					{title || meta.length ? (
						<dl class="flex flex-col gap-1.5 max-narrow:px-inset">
							{title && <Row label={COPY.field.title} value={title} />}
							{meta.map((item) => (
								<Row key={item.id} label={item.label} value={item.value} />
							))}
						</dl>
					) : (
						<EmptyHint>{COPY.empty}</EmptyHint>
					)}
				</Group>

				<Group text={COPY.step.describe} count={blocks.length}>
					{blocks.length ? (
						<div class="flex flex-col gap-3 max-narrow:px-inset">
							{blocks.map((block) => (
								<div key={block.id}>
									{block.label && (
										<h4 class="text-base font-bold text-ctp-mauve">{block.label}</h4>
									)}
									<p class={`line-clamp-4 whitespace-pre-wrap break-words ${SUB_TEXT}`}>
										{block.text}
									</p>
								</div>
							))}
						</div>
					) : (
						<EmptyHint>{COPY.empty}</EmptyHint>
					)}
				</Group>

				<Group text={COPY.section.footer} count={footer ? 1 : 0}>
					{footer ? (
						<p class={`break-words max-narrow:px-inset ${SUB_TEXT}`}>{footer}</p>
					) : (
						<EmptyHint>{COPY.empty}</EmptyHint>
					)}
				</Group>
			</div>
		</Panel>
	);
}
