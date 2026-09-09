import { Fragment } from 'preact';
import { latte } from '../lib/palette';
import type { CardData } from '../lib/types';

/**
 * 版权页分上中下三部分：标题、主体、页脚。
 * 主体左右两栏：左边一条条元数据，右边一块块长文本。
 * 文档流排版，字号用 rem，高度随内容增长。
 */
export function ColophonPage({ data, exitHref }: { data: CardData; exitHref?: string }) {
	const title = data.title.trim();
	const meta = data.meta.filter((item) => item.value.trim() !== '');
	const blocks = data.blocks.filter((block) => block.text.trim() !== '');

	return (
		<div class="colophon" style={{ background: latte.base, color: latte.text }}>
			<div class="colophon-inner">
				<header class="colophon-head">
					{title && <h1 class="colophon-title">{title}</h1>}
					{title && <div class="colophon-rule" style={{ background: latte.mauve }} />}
				</header>

				<main class={`colophon-body${meta.length > 0 ? '' : ' colophon-body--single'}`}>
					{meta.length > 0 && (
						<dl class="colophon-meta">
							{meta.map((item) => (
								<Fragment key={item.id}>
									<dt style={{ color: latte.subtext0 }}>{item.label.trim()}</dt>
									<dd>{item.value.trim()}</dd>
								</Fragment>
							))}
						</dl>
					)}

					<div class="colophon-blocks">
						{blocks.map((block) => (
							<section key={block.id} class="colophon-block">
								{block.label.trim() && (
									<h2 style={{ color: latte.mauve }}>{block.label.trim()}</h2>
								)}
								<p style={{ color: latte.subtext0 }}>{block.text.trim()}</p>
							</section>
						))}
					</div>
				</main>

				<footer class="colophon-footer" style={{ color: latte.overlay0 }}>
					<span>
						{exitHref && (
							<a class="colophon-exit" href={exitHref}>
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
