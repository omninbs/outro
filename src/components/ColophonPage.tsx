import { DEFAULT_TITLE } from '../lib/config';
import type { CardData } from '../lib/types';

/**
 * 版权页：上标题、中主体（左元数据 / 右文本块）、下页脚。
 * 全部用 Tailwind 工具类排版，配色用 Catppuccin 标准的 Latte（.latte 作用域）。
 */
export function ColophonPage({ data, exitHref }: { data: CardData; exitHref?: string }) {
	const title = data.title.trim() || DEFAULT_TITLE;
	const meta = data.meta.filter((item) => item.value.trim() !== '');
	const blocks = data.blocks.filter((block) => block.text.trim() !== '');

	return (
		<div class="latte flex flex-1 flex-col bg-ctp-base text-ctp-text antialiased">
			<div class="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-10 pt-16 sm:px-12 lg:px-16 lg:pt-24">
				<header>
					<h1 class="text-4xl font-semibold tracking-wide">{title}</h1>
					<div class="mt-4 h-0.5 w-16 bg-ctp-mauve" />
				</header>

				<main class="mt-12 grid flex-1 grid-cols-1 items-start gap-12 lg:mt-14 lg:grid-cols-3 lg:gap-16">
					<dl class="space-y-3">
						{meta.map((item) => (
							<div key={item.id} class="flex gap-4">
								<dt class="w-28 shrink-0 text-sm leading-relaxed text-ctp-subtext0">
									{item.label.trim()}
								</dt>
								<dd class="min-w-0 flex-1 break-words text-base leading-relaxed">
									{item.value.trim()}
								</dd>
							</div>
						))}
					</dl>

					<div class="space-y-8 lg:col-span-2">
						{blocks.map((block) => (
							<section key={block.id} class="space-y-3">
								{block.label.trim() && (
									<h2 class="text-sm font-medium tracking-widest text-ctp-mauve">
										{block.label.trim()}
									</h2>
								)}
								<p class="whitespace-pre-wrap break-words text-base leading-loose text-ctp-subtext0">
									{block.text.trim()}
								</p>
							</section>
						))}
					</div>
				</main>

				<footer class="mt-16 flex justify-between gap-8 text-sm tracking-wide text-ctp-overlay0">
					<span>
						{exitHref && (
							<a class="hover:underline print:hidden" href={exitHref}>
								编辑
							</a>
						)}
					</span>
					<span>{data.footerText.trim()}</span>
				</footer>
			</div>
		</div>
	);
}
