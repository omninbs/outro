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

		   窄屏（`max-narrow:grid-cols-1`）上下排成「名称一行、值一行」，跟编辑态的 `MetaEditor`
		   是同一条规矩——窄屏是一维的流，一行里塞两列不是这一档该有的样子 */
		<dl class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 max-narrow:grid-cols-1 wide:pt-1">
			{meta.map((item) => (
				<Fragment key={item.id}>
					<dt class={SUB_TEXT}>{item.label}</dt>
					<dd class="min-w-0 break-words text-base leading-relaxed">{item.value}</dd>
				</Fragment>
			))}
		</dl>
	);
}

/** 文本块（宽档下是右边那一栏），小标题留空时就只印正文 */
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

/**
 * 页脚：左边「返回编辑」（打印时隐藏），右边署名。
 *
 * 两端各只有一段短字，中档一行放得下，所以只在**最窄那一档**折起来（`max-narrow:flex-col`）。
 * 折与不折由档位写死，不靠 `flex-wrap` 让内容自己挤——那样看的人不知道它什么时候会换行。
 * （向导那份页脚内容多，中档就放不下了，所以它是反过来写的：`wide:` 才左右分列。）
 */
function OutroFooter({ footer, onExit }: { footer: string; onExit?: () => void }) {
	return (
		<footer class="mt-16 flex justify-between gap-x-8 gap-y-1 text-base tracking-wide text-ctp-overlay0 max-narrow:flex-col">
			<span>
				{onExit && (
					<button type="button" onClick={onExit} class="cursor-pointer hover:underline print:hidden">
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
 * 响应式跟别处**同一套**：只看宽度，窄 `< 30rem`（`max-narrow:`）一维的流、中档单栏加留白、
 * `wide:`（≥ 64rem）分两栏。它是拿去截图的那一屏，所以跟向导只有两处不同：
 *
 * ① 版面只有一个宽度数（`max-w-[48rem]`），比向导的容器窄一档——行短了看着更紧，截图也更像一张版面；
 * ② 整块在视口里**横竖都居中**：上下那点空隙不归内容，全部由剩余空间均分
 *    （`justify-center-safe`：内容比屏幕高时退回从顶部排，不会被切掉上半截）。
 *
 * 它身上没有「面」——没有卡片、没有底色、没有描边，所以窄屏那套「边距内化」落到这里
 * 就只是这条内边距本身：`px-6` 收到 `px-inset`（`max-narrow:px-inset`），文字仍落在
 * 跟全站同一条竖线上。
 */
export function OutroPage({ data, onExit }: { data: CardData; onExit?: () => void }) {
	const { title, meta, blocks, footer } = resolveOutro(data);

	return (
		<div class="flex flex-1 flex-col justify-center-safe">
			{/* 这一层就是版面本身：宽度上限、页边距、纵向那点最小留白都在这里。
			    宽度是「一行」的宽：中档单栏 `24rem`，宽档 `wide:48rem` —— 正好一倍，
			    因为宽档把那两栏并排（左元数据 1.2 : 右文本块 1），一栏就还是这一行的宽。
			    窄屏不另给数：它本来就比 24rem 窄，于是自然全宽 + `px-inset`，384–480 之间
			    则是这两条内边距（16 / 24）之差，行宽始终不变。
			    下面比上面多留 56px（`pb-26` = 6.5rem = 上面的 3rem + 3.5rem）：整块重心因此上移 28px，
			    也就是原来那个 `-translate-y-7` 光学补偿（一个标题的行高 = text-xl = 1.75rem）。
			    这里改用内边距拿，是因为它**真占布局**：内容比屏幕高时退回顶部排，标题还剩 pt 那点边距；
			    换成 translate 时实测只剩 4px（2026-09 探针量到的）。窄屏的 56px 差照旧（pt-8 / pb-22） */}
			<div class="mx-auto w-full max-w-[24rem] px-6 pt-12 pb-26 wide:max-w-[48rem] max-narrow:px-inset max-narrow:pt-8 max-narrow:pb-22">
				{title && <OutroHeader title={title} />}

				{/* 窄屏与中档都是一栏顺读，只有 `wide:`（宽 ≥ 1024）才分两栏。
				    左栏（元数据）比右栏（文本块）宽一点：元数据是一行一行的「名称 + 值」，
				    行数多、每行都要放得下值，块那边是整段文字，窄一点反而更好读 */}
				<main class="mt-12 grid grid-cols-1 items-start gap-12 wide:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
					<MetaList meta={meta} />
					<BlockList blocks={blocks} />
				</main>

				<OutroFooter footer={footer} onExit={onExit} />
			</div>
		</div>
	);
}
