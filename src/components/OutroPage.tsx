import { Fragment } from 'preact';

import { resolveOutro, type OutroBlock, type OutroMeta } from '../lib/outro';
import type { CardData } from '../lib/types';
import { SUB_TEXT } from './ui';

/** 页首：标题 + 一条短横线。标题空着就整块不渲染——留空没有兜底文案，横线也跟着走 */
function OutroHeader({ title }: { title: string }) {
	return (
		<header>
			<h1 class="text-xl leading-none font-semibold tracking-wide">{title}</h1>
			<div class="mt-4 h-0.5 w-16 bg-ctp-mauve" />
		</header>
	);
}

/** 元数据表（宽档下是左边那一栏）。名称列宽由内容决定，值列吃掉剩下的宽度 */
function MetaList({ meta }: { meta: OutroMeta[] }) {
	return (
		/* 中间那条线以上是分栏时才要的：右栏第一条是「描述」标题，笔画细、视觉重量轻，
		   跟左栏成片的元数据顶对齐会显得它飘在上面，把左栏压下去一点才平。
		   用内边距而不是外边距：内边距永远不参与合并，父级换成块级也照样生效。

		   这张表是全站唯一一处真二维的排布（名称列要跟行对齐，宽度由最长的名称决定），
		   所以只有它用表格；它又是宽档那一行里的左栏，跟右栏对分，值很长时自己还能收缩。

		   名称与值是一「条」，跟行对齐本身就是那条「对内紧」的线——最终页只跟中宽那一档走，
		   所以不必像编辑态与清单那样，为窄档另拆一种上下排的排法 */
		<dl class="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 wide:flex-[1] wide:pt-1">
			{meta.map((item) => (
				<Fragment key={item.id}>
					<dt class={SUB_TEXT}>{item.label}</dt>
					<dd class="min-w-0 break-words text-base leading-relaxed">{item.value}</dd>
				</Fragment>
			))}
		</dl>
	);
}

/** 文本块（宽档下是右边那一栏，占 1 份），小标题留空时就只印正文 */
function BlockList({ blocks }: { blocks: OutroBlock[] }) {
	return (
		<div class="flex min-w-0 flex-col gap-8 wide:flex-[1]">
			{blocks.map((block) => (
				<section key={block.id} class="flex flex-col gap-3">
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

/**
 * 署名：卡片里的第三段，靠右。
 *
 * 段间距由父层的 `gap` 给，自己不带外边距；只有一段短字，一行放得下。
 * 折与不折由结构写死，不靠 `flex-wrap` 让内容自己挤——那样看的人不知道它什么时候会换行。
 *
 * 卡片里**没有控件**：控件一进来就占住一块地方，署名能有多宽、于是从哪儿折行，就都由它决定——
 * 页面上挪一下按钮，成品里的折行跟着变（2026-09 栽过两次）。所以控件一律在向导那边。
 */
function OutroFooter({ footer }: { footer: string }) {
	return (
		<footer class="flex justify-end text-base tracking-wide text-ctp-overlay0">
			{footer && <span>{footer}</span>}
		</footer>
	);
}

/**
 * 结尾页：上标题、中主体（元数据 + 文本块）、下署名。
 * 只排版，不判断该显示什么——哪些行该印出来由 resolveOutro 决定，所以清单与最终页永远一致。
 *
 * 它是拿去截图的那一屏，所以要的是一张**版面**：一行有多宽由容器上限写死、不随观者的窗口变，
 * 整块在视口里横竖居中。
 * 它也就是**成品本身**：「保存为图片」拍的就是这一份（见 `src/lib/image.ts`），
 * 这份 HTML 与它这一身样式原样搬进图里，不另排一份——所以这一屏里**一颗控件都没有**，
 * 控件一律留在向导那边（存图归第三步，返回靠点这一屏的任意处）。
 */
export function OutroPage({ data, onExit }: { data: CardData; onExit?: () => void }) {
	const { title, meta, blocks, footer } = resolveOutro(data);

	return (
		/* 整屏都是「回去」的靶子：手指点哪儿都行，不用去找那颗按钮 */
		<div class="flex flex-1 cursor-pointer flex-col justify-center-safe" onClick={onExit}>
			{/* 这一层就是版面本身，也是图里被裁下来的那一块（`data-card` 是给存图找那一份用的）。
			    宽度上限 + 一圈内边距；上限不是照着容器定的数，是拿**「一行要多宽」反推出来的**——
			    居中那两档里内边距其实不起作用，只有视口窄到把容器顶住时才成为那道边距。
			    来龙去脉与那几个数见 `AGENTS.md` 的「响应式」 */}
			<div data-card class="mx-auto w-full max-w-[26rem] p-inset wide:max-w-[45rem]">
				{/* 三段（标题 / 主体 / 署名）在**一个**列里——所以没有谁的间距是挂在 margin 上的：
				    哪一段不印，那一份 `gap` 自动少掉，不会留下一段空白 */}
				<div class="flex flex-col gap-12">
					{title && <OutroHeader title={title} />}

					{/* 宽档才分两栏，两栏就是「一行」，所以用 flex 等分。
					   并排时两栏之间那道缝比段落之间的间距收一档：竖着排时留白是分段的，
					   并排时它是同一行里的一处停顿，跟段间距一样松就散了，两栏会各自成一段 */}
					<main class="flex flex-col gap-12 wide:flex-row wide:items-start wide:gap-10">
						<MetaList meta={meta} />
						<BlockList blocks={blocks} />
					</main>

					<OutroFooter footer={footer} />
				</div>
			</div>
		</div>
	);
}
