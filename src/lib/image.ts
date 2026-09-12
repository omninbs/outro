import { COPY } from './copy';
import { frameOf } from './frame';

/**
 * 保存图片：把结尾页装进 SVG，让浏览器画到一块画布上。
 *
 * 装进去的是**页面上排好的那一份**：外壳（卡片与它继承来的那一套）原样克隆，应用的 CSS 一并带上，
 * 克隆的视口宽度取屏幕上那一个——媒体查询、继承、百分比于是在同一套条件下解，
 * 卡片排出来的东西（含每一处折行）就是屏幕上那一份，不是「另排一份」。搬走的是**条件**，
 * 算仍旧交给浏览器当场算；那种「把每个元素算完的样式读出来、冻死在克隆上」的做法会漂，
 * 正是因为它把一个文档里的计算结果搬到了条件不同的另一个文档里。
 *
 * 一份成品由三样东西定：**排版的视口宽度**（三个档的判据，写死才跟观者的屏幕无关——
 * 在手机上按「横版」存出来的图，跟在大屏上存的是同一张）、**拍下来的那一块**（就是卡片自己）、
 * 以及**边距与长宽比**——后两样是纯几何，归 `frame.ts`。
 * 视口宽与卡片宽**不是一个数**：视口只把档位定死，卡片多宽由页面自己的宽度上限说了算——
 * 预览与存图于是落在同一个源上（图里那一块跟页面上看到的是同一个元素、同一套规矩），
 * 视口要是顺手把卡片撑满，存出来的就不是预览里那一份了。
 *
 * 尺寸一概读**排版尺寸**（`offsetWidth`），不读量到的矩形：取景台为了塞进屏幕把整份缩过一道，
 * 矩形是缩完的数，而图里那份是按排版尺寸排的。
 */

/** 存图中的一份：排版视口、画布长宽比、文件名后缀，以及给按钮看的那句话 */
export interface OutputPreset {
	/** 排版时用的视口宽度：窄 / 中 / 宽各取一个能把档位定死的数 */
	viewport: number;
	/** 画布的长宽比，宽比高 */
	aspect: number;
	/** 文件名后缀：同一份内容存三档，得从文件名上分得出 */
	suffix: string;
	/** 按钮上的那两个字：一行三颗并排，认的是「哪一档」 */
	label: string;
}

/**
 * 三档成品。`viewport` 直接写像素，不写 rem：画布与边距都是像素上的事，跟界面的字号无关。
 * 横版要踩在宽档线（64rem）以上，分栏才成立；竖版与方版都在它以下，排的是同一份单栏版面，
 * 两档的差别只在画布比例与四周留白。
 */
export const OUTPUTS: OutputPreset[] = [
	{ viewport: 456, aspect: 2 / 3, suffix: '2x3', label: COPY.output.portrait },
	{ viewport: 640, aspect: 1, suffix: '1x1', label: COPY.output.square },
	{ viewport: 1148, aspect: 3 / 2, suffix: '3x2', label: COPY.output.landscape },
];

/**
 * 光栅化的倍率：图里的字号小，一倍画出来发虚——SVG 与画布一起按这个倍数放大，
 * viewBox 不动，于是版面一个像素都不变，只是画得细一档。
 */
const SCALE = 2;

/** 画布边长上限（按放大后的画布算）：浏览器画布有上限，太大的也发不出去；按长边收到这个数 */
const LIMIT = 2160;

/** 文件名拿标题当名字：存下来的图多半是照标题认的；标题空着就叫「结尾页」 */
function fileName(title: string, suffix: string) {
	return `${title.trim().replace(/[\\/:*?"<>|]/g, '').slice(0, 60) || '结尾页'}-${suffix}.png`;
}

/**
 * 拍一张 `preset` 那一档的成品；`card` 是取景台里按 `preset.viewport` 排好的那一个。
 *
 * 图里那一份**就是卡片自己**：视口取卡片的尺寸，排版仍旧在设计宽下解一遍——
 * 外壳按设计宽摆好，再往左挪掉卡片左边空出来的那一段（居中是页面自己的规矩，那一段算得出来），
 * 卡片于是正好落在视口里。图上因此不用再裁：裁要靠另一处量来的位置，位置一变就缺内容。
 */
export async function saveImage(card: HTMLElement, preset: OutputPreset, title: string) {
	const content = { width: card.offsetWidth, height: card.offsetHeight };
	const left = Math.max(0, (preset.viewport - content.width) / 2);
	const shell = card.closest('.safe-area') ?? card;
	const background = getComputedStyle(shell).backgroundColor;

	const stage = shell.cloneNode(true) as HTMLElement;
	// 克隆是页面上的那一份：取景台把整份缩到屏里、挪出视野，克隆上一概不要
	stage.removeAttribute('style');
	stage.style.height = `${content.height}px`;
	// 「至少一屏高」是给页面用的：图里那一份的高度由卡片定，留着它会把卡片顶下去、上边空一截
	stage.style.minHeight = '0';
	// 宽度钉成排出来的那个数：图里没有滚动条，不钉住它就会比排出来的宽出十几像素、折行跟着变
	const pinned = stage.querySelector<HTMLElement>('[data-card]');
	if (pinned) pinned.style.width = `${content.width}px`;
	stage.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

	// 排版面：按设计宽摆一层（容器查询认的仍是页面外壳那一层），再把左边那段挪走，只挪画不动排版
	const board = document.createElement('div');
	board.style.width = `${preset.viewport}px`;
	board.style.position = 'relative';
	board.style.left = `${-left}px`;
	board.appendChild(stage);

	const css = [...document.querySelectorAll('style')].map((s) => s.textContent ?? '').join('\n');
	// 视口就是卡片：声明成放大后的尺寸、viewBox 不动，装进去的那一份于是照着原样放大，文字与细线因而更实
	const drawn =
		`<svg xmlns="http://www.w3.org/2000/svg" width="${content.width * SCALE}" height="${content.height * SCALE}" viewBox="0 0 ${content.width} ${content.height}">` +
		`<foreignObject width="${content.width}" height="${content.height}">` +
		`<html xmlns="http://www.w3.org/1999/xhtml"><head><style><![CDATA[${css}]]></style></head>` +
		`<body>${new XMLSerializer().serializeToString(board)}</body></html>` +
		`</foreignObject></svg>`;

	/* 装成 `data:` 而不是 `blob:`：Chromium 系把「blob URL 里装着外来内容（`foreignObject`）的 SVG」
	   当成异源，画到画布上会把画布弄脏，`toBlob` 随即抛 SecurityError——存图在那儿一颗都存不出来。
	   `data:` 不脏，且实测内容照画（2026-09 两种装法各试过一遍）。别图省事换回 blob。 */
	const shot = new Image();
	const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(drawn)}`;
	await new Promise((done, fail) => {
		shot.onload = done;
		shot.onerror = fail;
		shot.src = svgUrl;
	});

	const frame = frameOf(preset.aspect, content);
	// 画布被顶到上限时整幅一起收：卡片与留白同比例，图小一号但版面不变
	const size = Math.min(1, LIMIT / (frame.width * SCALE), LIMIT / (frame.height * SCALE));
	const width = Math.round(frame.width * size * SCALE);
	const height = Math.round(frame.height * size * SCALE);
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('画布开不出来');
	ctx.fillStyle = background;
	ctx.fillRect(0, 0, width, height);
	// 整幅图就是卡片那一块，照它自己的尺寸落到画布正中：上限触发的缩小因此是整幅等比，不是裁掉一块
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
	if (!blob) throw new Error('图片存不下来');

	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);
	link.href = url;
	link.download = fileName(title, preset.suffix);
	link.click();
	// 浏览器还要把 blob 读走，地址晚一步再放掉
	setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
