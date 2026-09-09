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
 * 生成卡片的 HTML 字符串。预览直接注入 DOM，导出时包进 SVG foreignObject。
 * 两种用法共用同一份标记，保证所见即所得。
 */
export function buildCardHtml(data: CardData, W: number, H: number): string {
	const c = flavors[data.flavor].colors;
	const accent = c[data.accent];
	const u = Math.min(W, H);
	const ts = (data.textScale || 100) / 100;

	const fTitle = Math.round(u * 0.058 * ts);
	const fLabel = Math.round(u * 0.021 * ts);
	const fValue = Math.round(u * 0.028 * ts);
	const fNoticeLabel = Math.round(u * 0.026 * ts);
	const fNoticeBody = Math.round(u * 0.023 * ts);
	const fFooter = Math.round(u * 0.018 * ts);

	const pad = Math.round(u * 0.05);
	const gap = Math.round(u * 0.016);
	const cellPad = Math.round(u * 0.018);
	const radius = Math.round(u * 0.012);
	const width = Math.min(Math.round(W * 0.82), Math.round(u * 1.35));

	const fields = data.fields.filter((f) => String(f.value).trim() !== '');
	const cols = fields.length >= 2 && W > u * 1.3 ? 2 : 1;

	const fieldsHtml = fields
		.map((f) => {
			const label = esc(f.label.trim());
			return (
				`<div style="box-sizing:border-box;background:${c.surface0};border:1px solid ${c.surface1};` +
				`border-left:3px solid ${accent};border-radius:${radius}px;padding:${cellPad}px;">` +
				(label
					? `<div style="font-size:${fLabel}px;color:${accent};font-weight:600;margin-bottom:${Math.round(u * 0.006)}px;">${label}</div>`
					: '') +
				`<div style="font-size:${fValue}px;color:${c.text};line-height:1.5;word-break:break-word;">${esc(String(f.value).trim())}</div>` +
				`</div>`
			);
		})
		.join('');

	const notice = String(data.notice).trim();
	const noticeHtml = notice
		? `<div style="box-sizing:border-box;width:${width}px;background:${c.mantle};border:1px solid ${c.surface0};` +
		  `border-left:4px solid ${accent};border-radius:${radius}px;padding:${Math.round(u * 0.024)}px;">` +
		  `<div style="font-size:${fNoticeLabel}px;color:${accent};font-weight:700;margin-bottom:${Math.round(u * 0.009)}px;">${esc(data.noticeLabel || '版权声明')}</div>` +
		  `<div style="font-size:${fNoticeBody}px;color:${c.subtext0};line-height:1.7;white-space:pre-wrap;word-break:break-word;">${esc(notice)}</div>` +
		  `</div>`
		: '';

	const footer =
		data.footerOn && String(data.footerText).trim()
			? `<div style="font-size:${fFooter}px;color:${c.overlay0};text-align:center;">${esc(data.footerText)}</div>`
			: '';

	const inset = Math.max(2, Math.round(u * 0.004));

	return (
		`<div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;overflow:hidden;box-sizing:border-box;` +
		`width:${W}px;height:${H}px;background:${c.base};color:${c.text};font-family:${FONT};">` +
		`<div style="position:absolute;inset:${inset}px;border:1px solid ${c.surface0};border-radius:${Math.round(u * 0.01)}px;"></div>` +
		`<div style="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;` +
		`box-sizing:border-box;width:100%;height:100%;padding:${pad}px;gap:${gap}px;">` +
		`<div style="font-size:${fTitle}px;font-weight:700;color:${c.text};text-align:center;letter-spacing:0.03em;">${esc(data.title)}</div>` +
		`<div style="width:${Math.round(width * 0.22)}px;height:3px;border-radius:99px;background:${accent};"></div>` +
		(fields.length
			? `<div style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:${gap}px;width:${width}px;">${fieldsHtml}</div>`
			: '') +
		noticeHtml +
		footer +
		`</div></div>`
	);
}
