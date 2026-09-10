import { Fragment } from 'preact';

import { DEFAULT_TITLE } from '../lib/config';
import type { CardData } from '../lib/types';

/**
 * 版权页：上标题、中主体（左元数据 / 右文本块）、下页脚。
 * 全部用 Tailwind 工具类排版，配色用 Catppuccin 标准的 Latte（.latte 作用域）。
 */
export function ColophonPage({ data, onExit }: { data: CardData; onExit?: () => void }) {
	const title = data.title.trim() || DEFAULT_TITLE;
	const meta = data.meta.filter((item) => item.value.trim() !== '');
	const blocks = data.blocks.filter((block) => block.text.trim() !== '');

	return (
		<div class="latte safe-area flex flex-1 flex-col bg-ctp-base text-ctp-text antialiased">
			<div class="mx-auto flex w-full flex-1 flex-col justify-center-safe px-8 py-16 sm:px-12 sm:py-20 lg:w-1/2 lg:px-10 lg:py-24">
				<header>
					<h1 class="text-xl font-semibold tracking-wide">{title}</h1>
					<div class="mt-4 h-0.5 w-16 bg-ctp-mauve" />
				</header>

				<main class="mt-12 grid grid-cols-1 items-start gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] xl:gap-12">
					<dl class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3">
						{meta.map((item) => (
							<Fragment key={item.id}>
								<dt class="text-base leading-relaxed text-ctp-subtext0">{item.label.trim()}</dt>
								<dd class="min-w-0 break-words text-base leading-relaxed">{item.value.trim()}</dd>
							</Fragment>
						))}
					</dl>

					<div class="space-y-8">
						{blocks.map((block) => (
							<section key={block.id} class="space-y-3">
								{block.label.trim() && (
									<h2 class="text-base font-bold tracking-widest text-ctp-mauve">
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

				<footer class="mt-16 flex justify-between gap-8 text-base tracking-wide text-ctp-overlay0">
					<span>
						{onExit && (
							<button
								type="button"
								onClick={onExit}
								class="cursor-pointer hover:underline print:hidden"
							>
								返回编辑
							</button>
						)}
					</span>
					<span>{data.footerText.trim()}</span>
				</footer>
			</div>
		</div>
	);
}
