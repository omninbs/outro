import { flavors } from './palette';
import type { CardData } from './types';

const FONT =
	"'PingFang SC','Microsoft YaHei','Noto Sans SC',system-ui,-apple-system,'Segoe UI',sans-serif";

const esc = (value: string) =>
	String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

/**
 * 文档式版式：不用任何容器（无填充块 / 边框 / 圆角），
 * 层级只由字号、字距、留白与两栏分栏表达。全卡仅一条强调色细线。
 */
export function buildCardHtml(data: CardData, W: number, H: number): string {
	const c = flavors[data.flavor].colors;
	const accent = c[data.accent];
	const u = Math.min(W, H);
	const ts = (data.textScale || 100) / 100;

	// 字号阶梯
	const fTitle = Math.round(u * 0.062 * ts);
	const fLabel = Math.round(u * 0.019 * ts);
	const fValue = Math.round(u * 0.024 * ts);
	const fNoticeLabel = Math.round(u * 0.019 * ts);
	const fNoticeBody = Math.round(u * 0.022 * ts);
	const fFooter = Math.round(u * 0.016 * ts);

	// 留白节奏
	const pad = Math.round(u * 0.1);
	const gapTitle = Math.round(u * 0.028);
	const gapRule = Math.round(u * 0.055);
	const gapBody = Math.round(u * 0.055);
	const gapRow = Math.round(u * 0.018);
	const gutter = Math.round(u * 0.055);

	// 正文区只占内容宽度的一部分，右侧留出安全距离
	const contentW = W - pad * 2;
	const bodyW = Math.round(contentW * 0.8);
	const leftW = Math.round(bodyW * 0.45);
	const rightW = bodyW - leftW - gutter;
	const labelW = Math.round(leftW * 0.44);

	const fields = data.fields.filter((f) => String(f.value).trim() !== '');
	const credits = fields
		.map((f) => {
			const label = esc(f.label.trim());
			return (
				`<div style="display:flex;align-items:baseline;gap:${Math.round(u * 0.014)}px;">` +
				(label
					? `<div style="flex:none;width:${labelW}px;font-size:${fLabel}px;color:${c.subtext0};letter-spacing:0.06em;line-height:1.6;">${label}</div>`
					: '') +
				`<div style="flex:1;font-size:${fValue}px;color:${c.text};line-height:1.6;word-break:break-word;">${esc(String(f.value).trim())}</div>` +
				`</div>`
			);
		})
		.join('');

	const notice = String(data.notice).trim();
	const noticeBlock = notice
		? `<div style="font-size:${fNoticeLabel}px;color:${accent};letter-spacing:0.1em;margin-bottom:${Math.round(u * 0.016)}px;">${esc(data.noticeLabel || '版权声明')}</div>` +
			`<div style="font-size:${fNoticeBody}px;color:${c.subtext0};line-height:1.85;white-space:pre-wrap;word-break:break-word;">${esc(notice)}</div>`
		: '';

	const creditsBlock = credits
		? `<div style="display:flex;flex-direction:column;gap:${gapRow}px;">${credits}</div>`
		: '';

	// 竖屏 / 方形卡片放不下两栏，改为上下堆叠
	const twoCols = Boolean(creditsBlock && noticeBlock) && W > u * 1.15;
	const body = twoCols
		? `<div style="display:flex;align-items:flex-start;gap:${gutter}px;">` +
			`<div style="flex:none;width:${leftW}px;">${creditsBlock}</div>` +
			`<div style="flex:none;width:${rightW}px;">${noticeBlock}</div>` +
			`</div>`
		: `<div style="display:flex;flex-direction:column;gap:${gapBody}px;width:${bodyW}px;">${creditsBlock}${noticeBlock}</div>`;

	const footer =
		data.footerOn && String(data.footerText).trim()
			? `<div style="position:absolute;right:${pad + (contentW - bodyW)}px;bottom:${pad}px;font-size:${fFooter}px;color:${c.overlay0};letter-spacing:0.08em;">${esc(data.footerText)}</div>`
			: '';

	return (
		`<div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;overflow:hidden;box-sizing:border-box;` +
		`width:${W}px;height:${H}px;background:${c.base};color:${c.text};font-family:${FONT};">` +
		`<div style="box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;` +
		`width:100%;height:100%;padding:${pad}px;">` +
		`<div style="font-size:${fTitle}px;font-weight:600;color:${c.text};letter-spacing:0.06em;line-height:1.25;">${esc(data.title)}</div>` +
		`<div style="width:${Math.round(u * 0.13)}px;height:${Math.max(2, Math.round(u * 0.0035))}px;background:${accent};margin-top:${gapTitle}px;"></div>` +
		`<div style="margin-top:${gapRule}px;">${body}</div>` +
		`</div>` +
		footer +
		`</div>`
	);
}
