import { COPY } from './copy';
import { frame_of } from './frame';

// 保存图片：把页面上排好的那一份装进 SVG，让浏览器按同一套条件当场画到画布上。

// 存图中的一份：排版视口、画布长宽比、文件名后缀，以及给按钮看的那句话
export interface OutputPreset {
	// 排版时用的视口宽度：窄 / 中 / 宽各取一个能把档位定死的数
	viewport: number;
	// 画布的长宽比，宽比高
	aspect: number;
	// 文件名后缀：同一份内容存三档，得从文件名上分得出
	suffix: string;
	// 按钮上的那两个字：一行三颗并排，认的是「哪一档」
	label: string;
}

// 三档成品：视口宽写像素，横版踩在宽档线以上才分栏，另两档共用单栏版面。
export const OUTPUTS: OutputPreset[] = [
	{ viewport: 456, aspect: 2 / 3, suffix: '2x3', label: COPY.output.portrait },
	{ viewport: 640, aspect: 1, suffix: '1x1', label: COPY.output.square },
	{ viewport: 1148, aspect: 3 / 2, suffix: '3x2', label: COPY.output.landscape },
];

// 光栅化的倍率：连 SVG 与画布一起放大，viewBox 不动，版面不变、画得更细。
const SCALE = 2;

// 画布边长上限（按放大后的画布算）：浏览器画布有上限，按长边收到这个数
const LIMIT = 2160;

// 文件名拿标题当名字：存下来的图多半是照标题认的；标题空着就叫「结尾页」
const file_name = (title: string, suffix: string) =>
	`${title.trim().replace(/[\\/:*?"<>|]/g, '').slice(0, 60) || '结尾页'}-${suffix}.png`;

// 拍 preset 那一档：视口取卡片的尺寸，外壳按设计宽摆好再左移居中留下的那一段，不用裁。
export async function save_image(card: HTMLElement, preset: OutputPreset, title: string) {
	const content = { width: card.offsetWidth, height: card.offsetHeight };
	const left = Math.max(0, (preset.viewport - content.width) / 2);
	const shell = card.closest('.safe-area') ?? card;
	const background = getComputedStyle(shell).backgroundColor;

	const stage = shell.cloneNode(true) as HTMLElement;
	// 克隆是页面上的那一份：取景台把整份缩到屏里、挪出视野，克隆上一概不要
	stage.removeAttribute('style');
	stage.style.height = `${content.height}px`;
	// 「至少一屏高」是给页面用的：留着它会把卡片顶下去、上边空一截
	stage.style.minHeight = '0';
	// 宽度钉成排出来的那个数：不钉住它会比排出来的宽、折行跟着变
	const pinned = stage.querySelector<HTMLElement>('[data-card]');
	if (pinned) pinned.style.width = `${content.width}px`;
	stage.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

	// 按设计宽摆一层，再把左边那段挪走：只挪画不动排版
	const board = document.createElement('div');
	board.style.width = `${preset.viewport}px`;
	board.style.position = 'relative';
	board.style.left = `${-left}px`;
	board.appendChild(stage);

	const css = [...document.querySelectorAll('style')].map((s) => s.textContent ?? '').join('\n');
	// 视口就是卡片：声明成放大后的尺寸、viewBox 不动，装进去的那一份照原样放大
	const drawn =
		`<svg xmlns="http://www.w3.org/2000/svg" width="${content.width * SCALE}" height="${content.height * SCALE}" viewBox="0 0 ${content.width} ${content.height}">` +
		`<foreignObject width="${content.width}" height="${content.height}">` +
		`<html xmlns="http://www.w3.org/1999/xhtml"><head><style><![CDATA[${css}]]></style></head>` +
		`<body>${new XMLSerializer().serializeToString(board)}</body></html>` +
		`</foreignObject></svg>`;

	// 装成 data: 而不是 blob：Chromium 把 blob 里的外来内容当异源，画布会被弄脏、toBlob 抛错
	const shot = new Image();
	const svg_url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(drawn)}`;
	await new Promise((done, fail) => {
		shot.onload = done;
		shot.onerror = fail;
		shot.src = svg_url;
	});

	const frame = frame_of(preset.aspect, content);
	// 画布被顶到上限时整幅一起收：卡片与留白同比例，图小一号但版面不变
	const size = Math.min(1, LIMIT / (frame.width * SCALE), LIMIT / (frame.height * SCALE));
	const width = Math.round(frame.width * size * SCALE);
	const height = Math.round(frame.height * size * SCALE);
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('canvas context unavailable');
	ctx.fillStyle = background;
	ctx.fillRect(0, 0, width, height);
	// 整幅图就是卡片那一块，照它自己的尺寸落到画布正中：上限触发的缩小是整幅等比
	const put = { width: content.width * size * SCALE, height: content.height * size * SCALE };
	ctx.drawImage(
		shot,
		0,
		0,
		shot.naturalWidth,
		shot.naturalHeight,
		Math.round((width - put.width) / 2),
		Math.round((height - put.height) / 2),
		put.width,
		put.height,
	);

	const blob = await new Promise<Blob | null>((done) => canvas.toBlob(done, 'image/png'));
	if (!blob) throw new Error('image blob unavailable');

	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);
	link.href = url;
	link.download = file_name(title, preset.suffix);
	link.click();
	// 浏览器还要把 blob 读走，地址晚一步再放掉
	setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
