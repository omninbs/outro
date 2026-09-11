import type { ComponentChildren } from 'preact';

import { COPY } from '../lib/copy';
import { resolveOutro } from '../lib/outro';
import type { CardData } from '../lib/types';
import { Panel, SUB_TEXT, EmptyHint } from './ui';

/** 分组标题：每组上面一条细线，第一组也不例外——免得它跟面板标题粘在一起 */
function Group({ text, count, children }: { text: string; count: number; children: ComponentChildren }) {
	return (
		<section class="flex flex-col gap-2 border-t border-ctp-surface0 pt-5">
			{/* 窄屏卡片贴边、不提供横向留白，所以标题行得自己带一次，才跟内容落在同一条竖线上
			   （上面那条细线属于「面」，贴边是刻意的） */}
			<div class="flex items-baseline justify-between gap-2 narrow:px-inset">
				<h3 class="text-base font-semibold tracking-wide text-ctp-subtext1">{text}</h3>
				<span class="text-base tabular-nums text-ctp-overlay0">{count}</span>
			</div>
			{children}
		</section>
	);
}

/**
 * 摘要里的一行元数据（标题也是其中一行）。名称列的宽度定死，各行的名称才对得齐；
 * **不截断**——截断会丢字，而这是给人最后确认用的清单，宁可它高一点。
 * 窄屏上下排，跟别处的元数据行是同一条规矩。
 */
function Row({ label, value }: { label: string; value: string }) {
	return (
		<div class="flex gap-3 text-base leading-relaxed narrow:flex-col narrow:gap-0.5">
			<dt class="w-24 shrink-0 text-ctp-subtext0 narrow:w-full">{label}</dt>
			<dd class="min-w-0 flex-1 break-words text-ctp-text narrow:flex-none">{value}</dd>
		</div>
	);
}

/**
 * 清单：按填写步骤分成三组，内容一律取自最终的结尾页（`resolveOutro`）——所见即最终页
 * 会印出来的东西，没写就空着，清单不自作主张补字。宽档它常驻表单旁，中档及以下改在
 * 最后一步之前显示一次，作最后的确认。哪一组空着就在那一组里放一个虚线提示：
 * 「空着」的后果（结尾页上那块不印）得写出来，不能让人自己推。
 */
export function FilledList({ data }: { data: CardData }) {
	const { title, meta, blocks, footer } = resolveOutro(data);

	return (
		<Panel title={COPY.section.list}>
			{/* 窄屏**有内容**的每个分支各自带一次留白；没内容那一支换成提示框，它自己带 */}
			<div class="flex flex-col gap-5">
				{/* 标题也能留空：没填就不印这一行，跟最终页一致 */}
				<Group text={COPY.step.summary} count={(title ? 1 : 0) + meta.length}>
					{title || meta.length ? (
						<dl class="flex flex-col gap-1.5 narrow:gap-2 narrow:px-inset">
							{/* 上下排之后，「对内紧、条间松」是唯一能把条目分开的东西 */}
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
						<div class="flex flex-col gap-3 narrow:px-inset">
							{blocks.map((block) => (
								<div key={block.id}>
									{block.label && (
										<h4 class="text-base font-bold text-ctp-mauve">{block.label}</h4>
									)}
									<p class={`whitespace-pre-wrap break-words ${SUB_TEXT}`}>
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
						<p class={`break-words narrow:px-inset ${SUB_TEXT}`}>{footer}</p>
					) : (
						<EmptyHint>{COPY.empty}</EmptyHint>
					)}
				</Group>
			</div>
		</Panel>
	);
}
