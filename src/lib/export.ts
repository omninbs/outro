import { buildCardHtml } from './card';
import { ratioOf } from './config';
import type { CardData } from './types';

export function cardSizeOf(data: CardData) {
	const r = ratioOf(data.ratio);
	return { w: Math.round(r.w * data.scale), h: Math.round(r.h * data.scale) };
}

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error('卡片渲染失败'));
		img.src = src;
	});
}

/** 借助 SVG foreignObject 把卡片标记画进 canvas，再导出为 PNG。无需第三方库。 */
export async function renderPng(data: CardData): Promise<Blob> {
	const { w, h } = cardSizeOf(data);
	const html = buildCardHtml(data, w, h);
	// 显式声明 UTF-8，并用 Blob 承载字节流，
	// 避免浏览器按系统默认编码（如 GBK）解码 SVG 导致中文乱码。
	const svg =
		`<?xml version="1.0" encoding="UTF-8"?>` +
		`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
		`<foreignObject width="100%" height="100%">${html}</foreignObject></svg>`;

	const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
	try {
		const img = await loadImage(url);

		const canvas = document.createElement('canvas');
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('无法创建画布');
		ctx.drawImage(img, 0, 0, w, h);

		return await new Promise<Blob>((resolve, reject) => {
			canvas.toBlob(
				(blob) => (blob ? resolve(blob) : reject(new Error('导出失败'))),
				'image/png',
			);
		});
	} finally {
		URL.revokeObjectURL(url);
	}
}

export function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 3000);
}

export async function copyBlob(blob: Blob) {
	if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
		throw new Error('当前浏览器不支持复制，请改用「导出 PNG」');
	}
	await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}
