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

		   窄屏（`max-narrow:grid-cols-1`）上下排成「名称一行、值一行」，跟编辑态的 `MetaEditor`
		   是同一条规矩——窄屏是一维的流，一行里塞两列不是这一档该有的样子。

		   这张表还是用 `grid`：它是**真二维**（名称列要跨行对齐，宽度由最长的名称决定）。
		   `wide:flex-[1]` 是它作为宽档那一行里左栏所占的份——跟右栏 **1 : 1 对分**
		   （2026-09 从 1.2 : 1 改成等分的），`min-w-0` 让值很长时这一栏仍能收缩

		   一对名称 / 值是一「条」，所以每对包一层：中宽档这层用 `contents` **整个消失**
		   （`dt` / `dd` 仍是 `dl` 的直接子项，跨行对齐就靠这一点，图片级零影响），
		   窄档它变成一个 flex 列，把「对内紧、条间松」那个节奏做出来——
		   对数跟清单里那套一样（对内 2px、条间 8px），见 `FilledList` 的 `Row` */
		<dl class="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 max-narrow:grid-cols-1 wide:flex-[1] wide:pt-1">
			{meta.map((item) => (
				<div key={item.id} class="contents max-narrow:flex max-narrow:flex-col max-narrow:gap-0.5">
					<dt class={SUB_TEXT}>{item.label}</dt>
					<dd class="min-w-0 break-words text-base leading-relaxed">{item.value}</dd>
				</div>
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
 * 页脚：左边「返回编辑」（打印时隐藏），右边署名。
 *
 * 它是最终页那一列里的第三段，段间距由父层的 `gap` 给，自己不带外边距。
 * 两端各只有一段短字，中档一行放得下，所以只在**最窄那一档**折起来（`max-narrow:flex-col`）。
 * 折与不折由档位写死，不靠 `flex-wrap` 让内容自己挤——那样看的人不知道它什么时候会换行。
 * （向导那份页脚内容多，中档就放不下了，所以它是反过来写的：`wide:` 才左右分列。）
 */
function OutroFooter({ footer, onExit }: { footer: string; onExit?: () => void }) {
	return (
		<footer class="flex justify-between gap-x-8 gap-y-1 text-base tracking-wide text-ctp-overlay0 max-narrow:flex-col">
			<span>
				{onExit && (
					<button type="button" onClick={onExit} class="cursor-pointer press:underline print:hidden">
						返回编辑
					</button>
				)}
			</span>
			{/* 署名留空就只剩「返回编辑」那一个子项，`justify-between` 把它放回左边；
			    打印时它本来就被 `print:hidden` 藏掉，于是空页脚整行不占东西 */}
			{footer && <span>{footer}</span>}
		</footer>
	);
}

/**
 * 结尾页：上标题、中主体（元数据 + 文本块）、下页脚。
 * 只排版，不判断该显示什么——哪些行该印出来由 resolveOutro 决定，
 * 所以清单与最终页永远一致。配色用 Catppuccin 标准的 Latte，由外层 PageShell 挂上。
 *
 * 它是拿去截图的那一屏，所以比别处多两条自己的规矩：**要一致的是「栏」（一行）的宽**，
 * 于是容器上限按栏宽反推、内边距只留一个数；以及整块在视口里**横竖都居中**。
 * 那些数连同来历都在 `AGENTS.md` 的「响应式」里——那是规格，注释只说想法。
 */
export function OutroPage({ data, onExit }: { data: CardData; onExit?: () => void }) {
	const { title, meta, blocks, footer } = resolveOutro(data);

	return (
		<div class="flex flex-1 flex-col justify-center-safe">
			{/* 这一层就是版面本身：宽度上限 + 一圈内边距。上限不是照着容器定的数，是拿
			    **「一行要多宽」反推出来的**——居中那两档里内边距其实不起作用，只有视口窄到
			    把容器顶住时才成为那道边距。来龙去脉与那几个数见 `AGENTS.md` 的「响应式」 */}
			<div class="mx-auto w-full max-w-[26rem] p-inset wide:max-w-[53rem]">
				{/* 三段（标题 / 主体 / 页脚）在**一个**列里，页脚也在这一列——所以没有谁的
				    间距是挂在 margin 上的：哪一段不印，那一份 `gap` 自动少掉，不会留下一段空白 */}
				<div class="flex flex-col gap-12">
					{title && <OutroHeader title={title} />}

					{/* 宽档才分两栏，两栏就是「一行」，所以用 flex 等分 */}
					<main class="flex flex-col gap-12 wide:flex-row wide:items-start">
						<MetaList meta={meta} />
						<BlockList blocks={blocks} />
					</main>

					<OutroFooter footer={footer} onExit={onExit} />
				</div>
			</div>
		</div>
	);
}
