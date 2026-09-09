// 生成静态设计预览页，方便快速看版式效果。
// 用法：npm run design  → 打开 design/preview.html
import { mkdirSync, writeFileSync } from 'node:fs';
import { buildCardHtml } from '../src/lib/card';
import { DEFAULT_CARD } from '../src/lib/config';
import type { CardData } from '../src/lib/types';

const OUT_DIR = 'design';
mkdirSync(OUT_DIR, { recursive: true });

const sample: CardData = {
	...DEFAULT_CARD,
	title: '歌曲信息',
	fields: [
		{ id: '1', label: '原歌曲作者', value: 'Kevin Penkin' },
		{ id: '2', label: 'NBS 作者', value: 'CMY' },
		{ id: '3', label: '结构设计者', value: 'CMY' },
		{ id: '4', label: '原曲链接', value: 'BV1xx411c7mD' },
		{ id: '5', label: '扒谱日期', value: '2026-09-09' },
	],
	noticeLabel: '版权声明',
	notice:
		'本工程仅供学习交流与个人收藏使用。允许转载分享，转载时请注明原歌曲作者与本工程作者，并保留本声明。' +
		'禁止商用、售卖或用于付费订阅；如需二创或商业合作，请先取得授权。',
	footerText: '由 colophon 生成',
};

const variants: { caption: string; data: CardData; w: number; h: number }[] = [
	{ caption: 'Mocha · 16:9 · mauve', data: { ...sample, flavor: 'mocha', accent: 'mauve' }, w: 1280, h: 720 },
	{ caption: 'Latte · 16:9 · blue', data: { ...sample, flavor: 'latte', accent: 'blue' }, w: 1280, h: 720 },
	{ caption: 'Macchiato · 1:1 · teal', data: { ...sample, flavor: 'macchiato', accent: 'teal' }, w: 1080, h: 1080 },
	{ caption: 'Frappé · 9:16 · peach', data: { ...sample, flavor: 'frappe', accent: 'peach' }, w: 720, h: 1280 },
];

const DISPLAY = 720;

const cards = variants
	.map(({ caption, data, w, h }) => {
		const scale = DISPLAY / w;
		return (
			`<figure>` +
			`<div class="frame" style="width:${DISPLAY}px;aspect-ratio:${w}/${h};">` +
			`<div class="inner" style="width:${w}px;height:${h}px;transform:scale(${scale.toFixed(4)});">` +
			buildCardHtml(data, w, h) +
			`</div></div>` +
			`<figcaption>${caption} · ${w}×${h}</figcaption>` +
			`</figure>`
		);
	})
	.join('\n');

// 单卡页面：给无头浏览器截图用，尺寸与画布严格一致。
variants.forEach(({ data, w, h }, index) => {
	const shot =
		`<!DOCTYPE html><html><head><meta charset="UTF-8" />` +
		`<style>html,body{margin:0;padding:0;overflow:hidden}</style></head>` +
		`<body>${buildCardHtml(data, w, h)}</body></html>`;
	writeFileSync(`${OUT_DIR}/shot-${index}.html`, shot);
});

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>版权页版式预览</title>
<style>
	body {
		margin: 0;
		padding: 48px;
		background: #181825;
		color: #cdd6f4;
		font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", system-ui, sans-serif;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 40px;
	}
	figure { margin: 0; }
	.frame { position: relative; overflow: hidden; border-radius: 6px; }
	.inner { position: absolute; top: 0; left: 0; transform-origin: top left; }
	figcaption {
		margin-top: 10px;
		font-size: 12px;
		letter-spacing: 0.08em;
		color: #7f849c;
	}
</style>
</head>
<body>
${cards}
</body>
</html>
`;

writeFileSync(`${OUT_DIR}/preview.html`, html);
console.log(`wrote ${OUT_DIR}/preview.html (${variants.length} variants)`);
