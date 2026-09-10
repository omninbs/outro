import { Fragment } from 'preact';

import { resolveOutro, type OutroBlock, type OutroMeta } from '../lib/outro';
import type { CardData } from '../lib/types';
import { SUB_TEXT } from './ui';

/** 页首：标题 + 一条短横线 */
function OutroHeader({ title }: { title: string }) {
	return (
		<header>
			<h1 class="text-xl leading-none font-semibold tracking-wide">{title}</h1>
			<div class="mt-4 h-0.5 w-16 bg-ctp-mauve" />
		</header>
	);
}

/** 左栏：元数据表。名称列宽由内容决定，值列吃掉剩下的宽度 */
function MetaList({ meta }: { meta: OutroMeta[] }) {
	return (
		/* 分栏时才需要 landscape:pt-1 这个补偿：右栏第一条是「描述」标题，笔画细、视觉重量轻，
		   跟左栏成片的元数据顶对齐会显得它飘在上面，把左栏压下去一点才平。
		   用内边距而不是外边距：内边距永远不参与合并，父级换成块级也照样生效 */
		<dl class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3 landscape:pt-1">
			{meta.map((item) => (
				<Fragment key={item.id}>
					<dt class={SUB_TEXT}>{item.label}</dt>
					<dd class="min-w-0 break-words text-base leading-relaxed">{item.value}</dd>
				</Fragment>
			))}
		</dl>
	);
}

/** 右栏：文本块，小标题留空时就只印正文 */
function BlockList({ blocks }: { blocks: OutroBlock[] }) {
	return (
		<div class="space-y-8">
			{blocks.map((block) => (
				<section key={block.id} class="space-y-3">
					{block.label && (
						<h2 class="text-base leading-none font-bold tracking-widest text-ctp-mauve">
							{block.label}
						</h2>
					)}
					<p class="whitespace-pre-wrap break-words text-base leading-loose text-ctp-subtext0">
						{block.text}
					</p>
				</section>
			))}
		</div>
	);
}

/** 页脚：左边「返回编辑」（打印时隐藏），右边署名 */
function OutroFooter({ footer, onExit }: { footer: string; onExit?: () => void }) {
	return (
		<footer class="mt-16 flex justify-between gap-8 text-base tracking-wide text-ctp-overlay0">
			<span>
				{onExit && (
					<button type="button" onClick={onExit} class="cursor-pointer hover:underline print:hidden">
						返回编辑
					</button>
				)}
			</span>
			<span>{footer}</span>
		</footer>
	);
}

/**
 * 结尾页：上标题、中主体（左元数据 / 右文本块）、下页脚。
 * 只排版，不判断该显示什么——哪些行该印出来由 resolveOutro 决定，
 * 所以清单与最终页永远一致。配色用 Catppuccin 标准的 Latte，由外层 PageShell 挂上。
 */
export function OutroPage({ data, onExit }: { data: CardData; onExit?: () => void }) {
	const { title, meta, blocks, footer } = resolveOutro(data);

	return (
		<div class="flex flex-1 flex-col">
			{/* 版面宽度就是一条直线：max-width = 25vw + 30rem（含左右各 3rem 内边距，所以
			    measure = 25vw + 24rem）。没有断点也没有 clamp，留白斜率恒定（单侧 0.375）：
			    1024 时 measure 640（两栏 257/335 不挤），1920 时 864，正好等于原来的「一半宽」，
			    更宽就沿同一条线继续长。想更平缓就把 25vw 调大，两端会跟着移动 */}
			{/* 这一层的框就是屏幕：flex-1 撑满，除了左右留着防贴边的内边距，纵向不给 padding。
			    纵向的空隙全部来自剩余空间，由 justify-center-safe 分给内容上下 */}
			<div class="mx-auto flex w-full max-w-[calc(25vw_+_30rem)] flex-1 flex-col justify-center-safe px-8 landscape:px-12">
				{/* 整体上移一个标题的行高（text-xl = 1.75rem = 28px）。用 translate 而不是内边距差：
				    它是独立的一个数，不占布局、不影响居中，内容再高也不会把这 28px 吃掉 */}
				<div class="-translate-y-7">
					<OutroHeader title={title} />

					{/* 宽屏就是比例 > 1（宽 > 高）：分两栏并排。竖屏、方形比例的窗口一律单栏顺读 */}
					<main class="mt-12 grid grid-cols-1 items-start gap-12 landscape:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
						<MetaList meta={meta} />
						<BlockList blocks={blocks} />
					</main>

					<OutroFooter footer={footer} onExit={onExit} />
				</div>
			</div>
		</div>
	);
}
