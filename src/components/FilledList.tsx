import type { ComponentChildren } from 'preact';

import { COPY } from '../lib/copy';
import { resolveOutro } from '../lib/outro';
import type { CardData } from '../lib/types';
import { BLOCK_HEADING, CARD_HEADING, Panel, SUB_TEXT, EmptyHint } from './ui';

// 分组标题：每组上面一条细线，第一组也不例外，免得跟面板标题粘在一起
function Group({ text, count, children }: { text: string; count: number; children: ComponentChildren }) {
	return (
		<section class="flex flex-col gap-2 border-t border-ctp-surface0 pt-5">
			<div class="flex items-baseline justify-between gap-2 narrow:px-inset">
				<h3 class={`text-base ${CARD_HEADING}`}>{text}</h3>
				<span class="text-base tabular-nums text-ctp-overlay0">{count}</span>
			</div>
			{children}
		</section>
	);
}

// 摘要的一行元数据：名称列定宽以对齐各行，不截断；窄屏上下排
function Row({ label, value }: { label: string; value: string }) {
	return (
		<div class="flex gap-3 text-base leading-relaxed narrow:flex-col narrow:gap-0.5">
			<dt class="w-24 shrink-0 text-ctp-subtext0 narrow:w-full">{label}</dt>
			<dd class="min-w-0 flex-1 break-words text-ctp-text narrow:flex-none">{value}</dd>
		</div>
	);
}

// 清单：按填写步骤分三组，内容取自最终页（resolveOutro）；哪组空着就放虚线提示
export function FilledList({ data }: { data: CardData }) {
	const { title, meta, blocks, footer } = resolveOutro(data);

	return (
		<Panel title={COPY.section.list}>
			<div class="flex flex-col gap-5">
				<Group text={COPY.step.summary} count={(title ? 1 : 0) + meta.length}>
					{title || meta.length ? (
						<dl class="flex flex-col gap-1.5 narrow:gap-2 narrow:px-inset">
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
										<h4 class={`text-base ${BLOCK_HEADING}`}>{block.label}</h4>
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
