import type { CardData } from '../lib/types';
import { Panel } from './ui';

const Empty = ({ text }: { text: string }) => (
	<p class="rounded-md border border-dashed border-ctp-surface1 px-3 py-3 text-center text-base text-ctp-overlay0">
		{text}
	</p>
);

const Head = ({ text, count }: { text: string; count: number }) => (
	<div class="mb-2 flex items-baseline justify-between gap-2">
		<h3 class="text-base font-semibold tracking-wide text-ctp-subtext1">{text}</h3>
		<span class="text-base tabular-nums text-ctp-overlay0">{count}</span>
	</div>
);

/** 填写阶段的右侧预览：只列出「现在填了哪些信息」，不再渲染整页。 */
export function FilledList({ data }: { data: CardData }) {
	const title = data.title.trim();
	const meta = data.meta.filter((item) => item.value.trim() !== '');
	const blocks = data.blocks.filter((block) => block.text.trim() !== '');
	const footer = data.footerText.trim();
	const total = (title ? 1 : 0) + meta.length + blocks.length + (footer ? 1 : 0);

	return (
		<Panel title="已填信息">
			{total === 0 ? (
				<Empty text="还没有填写内容，从左侧第一步开始" />
			) : (
				<div class="space-y-5">
					<section>
						<Head text="标题" count={title ? 1 : 0} />
						{title ? (
							<p class="break-words text-lg font-semibold">{title}</p>
						) : (
							<Empty text="未填写" />
						)}
					</section>

					<section>
						<Head text="元数据" count={meta.length} />
						{meta.length ? (
							<dl class="space-y-1.5">
								{meta.map((item) => (
									<div key={item.id} class="flex gap-3 text-base leading-relaxed">
										<dt class="w-24 shrink-0 truncate text-ctp-subtext0">
											{item.label.trim() || '未命名'}
										</dt>
										<dd class="min-w-0 flex-1 break-words text-ctp-text">
											{item.value.trim()}
										</dd>
									</div>
								))}
							</dl>
						) : (
							<Empty text="未填写" />
						)}
					</section>

					<section>
						<Head text="文本块" count={blocks.length} />
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
						) : (
							<Empty text="未填写" />
						)}
					</section>

					<section>
						<Head text="页脚" count={footer ? 1 : 0} />
						{footer ? (
							<p class="break-words text-base text-ctp-subtext0">{footer}</p>
						) : (
							<Empty text="未填写" />
						)}
					</section>
				</div>
			)}
		</Panel>
	);
}
