import { Fragment } from 'preact';
import { useRef } from 'preact/hooks';

import { COPY } from '../lib/copy';
import { resolve_outro, type OutroBlock, type OutroMeta } from '../lib/outro';
import type { CardData } from '../lib/types';
import { BLOCK_HEADING, SUB_TEXT } from '../components/ui';

// 页首：标题 + 一条短横线；标题空着就整块不渲染
function OutroHeader({ title }: { title: string }) {
	return (
		<header class="flex flex-col gap-4">
			<h1 class="text-xl leading-none font-semibold tracking-wide">{title}</h1>
			<div class="h-0.5 w-16 bg-ctp-mauve" />
		</header>
	);
}

// 元数据表（宽档左栏）：名称列宽由内容决定，值列吃掉剩下的宽度
function MetaList({ meta }: { meta: OutroMeta[] }) {
	return (
		// 这张表是全站唯一一处真二维的排布，所以用表格；宽档里它是左栏，值很长时能收缩
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

// 文本块（宽档右栏），小标题留空时就只印正文
function BlockList({ blocks }: { blocks: OutroBlock[] }) {
	return (
		<div class="flex min-w-0 flex-col gap-8 wide:flex-[1]">
			{blocks.map((block) => (
				<section key={block.id} class="flex flex-col gap-3">
					{block.label && (
						<h2 class={`text-base leading-none ${BLOCK_HEADING}`}>
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

// 署名：卡片第三段，靠右；段间距由父层 gap 给，卡片里没有控件
function OutroFooter({ footer }: { footer: string }) {
	return (
		<footer class="flex justify-end text-base tracking-wide text-ctp-overlay0">
			{footer && <span>{footer}</span>}
		</footer>
	);
}

// 结尾页：上标题、中主体、下署名；只排版不判断，内容由 resolve_outro 决定
export function OutroPage({ data, on_exit }: { data: CardData; on_exit?: () => void }) {
	const { title, meta, blocks, footer } = resolve_outro(data);
	// 按下时手指在哪儿：拖选文字与双击选词也会派一次 click，那不是「点一下就走」
	const pressed = useRef<{ x: number; y: number } | null>(null);

	return (
		// 整屏都是「回去」的靶子：点哪儿都行，键盘用 Tab 进来按回车或空格
		<div
			class="flex flex-1 cursor-pointer flex-col justify-center-safe"
			role={on_exit ? 'button' : undefined}
			tabIndex={on_exit ? 0 : undefined}
			aria-label={on_exit ? COPY.action.back_to_edit : undefined}
			onPointerDown={(event) => {
				pressed.current = { x: event.clientX, y: event.clientY };
			}}
			onClick={(event) => {
				const from = pressed.current;
				pressed.current = null;
				if (!on_exit || !from) return;
				// 手移开了就是在选字：选中的内容不该连同这一屏一起没了
				if (Math.hypot(event.clientX - from.x, event.clientY - from.y) > 8) return;
				on_exit();
			}}
			onKeyDown={(event) => {
				if (!on_exit || (event.key !== 'Enter' && event.key !== ' ')) return;
				event.preventDefault();
				on_exit();
			}}
		>
			<div data-card class="mx-auto w-full max-w-[26rem] p-inset wide:max-w-[45rem]">
				<div class="flex flex-col gap-12">
					{title && <OutroHeader title={title} />}

					<main class="flex flex-col gap-12 wide:flex-row wide:items-start wide:gap-8">
						<MetaList meta={meta} />
						<BlockList blocks={blocks} />
					</main>

					<OutroFooter footer={footer} />
				</div>
			</div>
		</div>
	);
}
