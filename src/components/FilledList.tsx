import type { ComponentChildren } from 'preact';

import { resolveOutro } from '../lib/outro';
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
 * 清单：按填写步骤分成摘要、描述、页脚三组，内容一律取自最终的结尾页（resolveOutro），
 * 所见即最终页会印出来的东西。
 * 横屏且够宽时固定在右侧随时可见；竖屏（高 > 宽）放不下右侧栏，
 * 改在第三步「生成」前显示一次，作最后的确认。
 */
export function FilledList({ data }: { data: CardData }) {
	const { title, meta, blocks, footer } = resolveOutro(data);

	return (
		<Panel title="清单">
			<div class="space-y-5">
				{/* 标题不是可选项：没填也会用默认文案，跟最终页一致，所以标题这一行永远在 */}
				<Group text="摘要" count={1 + meta.length}>
					<dl class="space-y-1.5">
						<Row label="标题" value={title} />
						{meta.map((item) => (
							// 清单是拿来核对的，忘了写名称的行标成「未命名」；最终页只印原名
							<Row key={item.id} label={item.label || '未命名'} value={item.value} />
						))}
					</dl>
				</Group>

				<Group text="描述" count={blocks.length}>
					{blocks.length ? (
						<div class="space-y-3">
							{blocks.map((block) => (
								<div key={block.id}>
									{block.label && (
										<h4 class="text-base font-bold text-ctp-mauve">{block.label}</h4>
									)}
									<p class="line-clamp-4 whitespace-pre-wrap break-words text-base leading-relaxed text-ctp-subtext0">
										{block.text}
									</p>
								</div>
							))}
						</div>
					) : null}
				</Group>

				<Group text="页脚" count={1}>
					<p class="break-words text-base text-ctp-subtext0">{footer}</p>
				</Group>
			</div>
		</Panel>
	);
}
