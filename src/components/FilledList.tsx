import type { ComponentChildren } from 'preact';

import { DEFAULT_FOOTER, DEFAULT_TITLE } from '../lib/config';
import type { CardData } from '../lib/types';
import { Panel } from './ui';

/** 分组标题：摘要 / 描述 / 页脚。每组上面一条细线，第一组也不例外，免得跟面板标题粘在一起 */
const Group = ({ text, count, children }: { text: string; count: number; children: ComponentChildren }) => (
	<section class="border-t border-ctp-surface0 pt-5">
		<div class="mb-2 flex items-baseline justify-between gap-2">
			<h3 class="text-base font-semibold tracking-wide text-ctp-subtext1">{text}</h3>
			<span class="text-base tabular-nums text-ctp-overlay0">{count}</span>
		</div>
		{children}
	</section>
);

/** 摘要里的一行元数据，标题也是其中一行 */
const Row = ({ label, value }: { label: string; value: string }) => (
	<div class="flex gap-3 text-base leading-relaxed">
		<dt class="w-24 shrink-0 truncate text-ctp-subtext0">{label}</dt>
		<dd class="min-w-0 flex-1 break-words text-ctp-text">{value}</dd>
	</div>
);

/**
 * 清单：按填写步骤分成摘要、描述、页脚三组。
 * 横屏且够宽时固定在右侧随时可见；竖屏（高 > 宽）放不下右侧栏，
 * 改在第三步「生成」前显示一次，作最后的确认。
 */
export function FilledList({ data }: { data: CardData }) {
	const cardTitle = data.title.trim();
	const meta = data.meta.filter((item) => item.value.trim() !== '');
	const blocks = data.blocks.filter((block) => block.text.trim() !== '');
	const footer = data.footerText.trim();
	// 页脚始终会生成，没填就是默认文案
	const shownFooter = footer || DEFAULT_FOOTER;

	return (
		<Panel title="清单">
			<div class="space-y-5">
				<Group text="摘要" count={(cardTitle ? 1 : 0) + meta.length}>
					{cardTitle || meta.length ? (
						<dl class="space-y-1.5">
							<Row label="标题" value={cardTitle || DEFAULT_TITLE} />
							{meta.map((item) => (
								<Row key={item.id} label={item.label.trim() || '未命名'} value={item.value.trim()} />
							))}
						</dl>
					) : null}
				</Group>

				<Group text="描述" count={blocks.length}>
					{blocks.length ? (
						<div class="space-y-3">
							{blocks.map((block) => (
								<div key={block.id}>
									{block.label.trim() && (
										<h4 class="text-base font-bold text-ctp-mauve">{block.label.trim()}</h4>
									)}
									<p class="line-clamp-4 whitespace-pre-wrap break-words text-base leading-relaxed text-ctp-subtext0">
										{block.text.trim()}
									</p>
								</div>
							))}
						</div>
					) : null}
				</Group>

				<Group text="页脚" count={1}>
					<p class="break-words text-base text-ctp-subtext0">{shownFooter}</p>
				</Group>
			</div>
		</Panel>
	);
}
