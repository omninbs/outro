import { Fragment } from 'preact';
import {
	DEFAULT_FOOTER,
	DEFAULT_NOTICE,
	DEFAULT_NOTICE_LABEL,
	DEFAULT_TITLE,
} from '../lib/config';
import { latte } from '../lib/palette';
import type { CardData } from '../lib/types';

/**
 * 版权页就是一个文档页面：内容按文档流从顶部排下来，
 * 字号用 rem，高度随内容增长，可以滚动。配色固定为 Catppuccin Latte。
 */
export function ColophonPage({ data, exitHref }: { data: CardData; exitHref?: string }) {
	const title = data.title.trim() || DEFAULT_TITLE;
	const noticeLabel = data.noticeLabel.trim() || DEFAULT_NOTICE_LABEL;
	const notice = data.notice.trim() || DEFAULT_NOTICE;
	const footerText = data.footerText.trim() || DEFAULT_FOOTER;
	const fields = data.fields.filter((f) => f.value.trim() !== '');

	return (
		<div class="colophon" style={{ background: latte.base, color: latte.text }}>
			<div class="colophon-inner">
				<main class="colophon-main">
					<h1 class="colophon-title">{title}</h1>
					<div class="colophon-rule" style={{ background: latte.mauve }} />

					{fields.length > 0 && (
						<dl class="colophon-credits">
							{fields.map((field) => (
								<Fragment key={field.id}>
									<dt style={{ color: latte.subtext0 }}>{field.label.trim()}</dt>
									<dd>{field.value.trim()}</dd>
								</Fragment>
							))}
						</dl>
					)}

					<section class="colophon-notice">
						<h2 style={{ color: latte.mauve }}>{noticeLabel}</h2>
						<p style={{ color: latte.subtext0 }}>{notice}</p>
					</section>
				</main>

				<footer class="colophon-footer" style={{ color: latte.overlay0 }}>
					<span>
						{exitHref && (
							<a class="colophon-exit" href={exitHref}>
								编辑
							</a>
						)}
					</span>
					<span>{footerText}</span>
				</footer>
			</div>
		</div>
	);
}
