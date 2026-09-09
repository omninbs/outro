import { Fragment } from 'preact';
import {
	DEFAULT_FOOTER,
	DEFAULT_NOTICE,
	DEFAULT_NOTICE_LABEL,
	DEFAULT_TITLE,
} from '../lib/config';
import { flavors } from '../lib/palette';
import type { CardData } from '../lib/types';

/**
 * 版权页就是一个文档页面：内容按文档流从顶部排下来，
 * 字号用 rem（只受「文字大小」影响），高度随内容增长，可以滚动。
 */
export function ColophonPage({ data, exitHref }: { data: CardData; exitHref?: string }) {
	const c = flavors[data.flavor].colors;
	const accent = c[data.accent];
	const ts = (data.textScale || 100) / 100;

	const title = data.title.trim() || DEFAULT_TITLE;
	const noticeLabel = data.noticeLabel.trim() || DEFAULT_NOTICE_LABEL;
	const notice = data.notice.trim() || DEFAULT_NOTICE;
	const footerText = data.footerText.trim() || DEFAULT_FOOTER;
	const fields = data.fields.filter((f) => f.value.trim() !== '');

	return (
		<div
			class="colophon"
			style={{ background: c.base, color: c.text, ['--ts' as string]: ts }}
		>
			<div class="colophon-inner">
				<main class="colophon-main">
					<h1 class="colophon-title">{title}</h1>
					<div class="colophon-rule" style={{ background: accent }} />

					{fields.length > 0 && (
						<dl class="colophon-credits">
							{fields.map((field) => (
								<Fragment key={field.id}>
									<dt style={{ color: c.subtext0 }}>{field.label.trim()}</dt>
									<dd>{field.value.trim()}</dd>
								</Fragment>
							))}
						</dl>
					)}

					<section class="colophon-notice">
						<h2 style={{ color: accent }}>{noticeLabel}</h2>
						<p style={{ color: c.subtext0 }}>{notice}</p>
					</section>
				</main>

				<footer class="colophon-footer" style={{ color: c.overlay0 }}>
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
