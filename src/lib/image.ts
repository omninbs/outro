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
 * 以及**边距与长宽比**（窄 2:3 / 中 1:1 / 宽 3:2）：卡片只占画布的一部分，
 * 四周留白取它较长的那一条的一个比例。
 * 视口宽与卡片宽**不是一个数**：视口只把档位定死，卡片多宽由页面自己的宽度上限说了算——
 * 预览与存图于是落在同一个源上（图里那一块跟页面上看到的是同一个元素、同一套规矩），
 * 视口要是顺手把卡片撑满，存出来的就不是预览里那一份了。
 * 长宽比与边距定死画布：先按留白反推一个刚好装下卡片的画布，再把短的一条撑到长宽比上——
 * 于是比例一定是 2:3 / 1:1 / 3:2，边距只会**更多**、不会被吃掉（内容越长，画布越长）。
 * 留白因此是**下限**，不是定数：内容一多，四周只会更松，这是卡片本身的比例买来的。
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
	{ viewport: 456, aspect: 2 / 3, suffix: '2x3', label: '竖版' },
	{ viewport: 640, aspect: 1, suffix: '1x1', label: '方版' },
	{ viewport: 1148, aspect: 3 / 2, suffix: '3x2', label: '横版' },
];

/** 四周留白的下限：拍下来那一块最长边的这个比例那一边至少这么宽 */
const MARGIN = 1 / 8;

/**
 * 光栅化的倍率：图里的字号小，一倍画出来发虚——SVG 与画布一起按这个倍数放大，
 * viewBox 不动，于是版面一个像素都不变，只是画得细一档。
 */
const SCALE = 2;

/** 画布边长上限（按放大后的画布算）：浏览器画布有上限，太大的也发不出去；按长边收到这个数 */
const LIMIT = 2160;

/**
 * 画布定法：先把那一块按留白那圈撑开，再看长宽比——短的一条由长的一条与比例决定，
 * 所以比例永远是对的，长的那一条那两侧的留白恰好是那圈，短的两侧只会更宽。
 */
function frameOf(aspect: number, box: { width: number; height: number }) {
	const spread = 2 * MARGIN * Math.max(box.width, box.height);
	const wide = box.width + spread;
	const high = box.height + spread;
	return wide >= high * aspect ? { width: wide, height: wide / aspect } : { width: high * aspect, height: high };
}

/** 文件名拿标题当名字：存下来的图多半是照标题认的；标题空着就叫「结尾页」 */
function fileName(title: string, suffix: string) {
	return `${title.trim().replace(/[\\/:*?"<>|]/g, '').slice(0, 60) || '结尾页'}-${suffix}.png`;
}

/**
 * 拍一张 `preset` 那一档的成品；`card` 是取景台里按 `preset.viewport` 排好的那一个。
 *
 * 画布与裁切都按**卡片自己**量（排版尺寸），不按排版的视口：视口只把档位定死，
 * 卡片多宽由页面自己的规矩给。卡片在视口里是居中的，所以裁的时候要从它左边那一段起。
 */
export async function saveImage(card: HTMLElement, preset: OutputPreset, title: string) {
	const content = { width: card.offsetWidth, height: card.offsetHeight };
	const left = card.offsetLeft;
	const shell = card.closest('.safe-area') ?? card;
	const background = getComputedStyle(shell).backgroundColor;

	const stage = shell.cloneNode(true) as HTMLElement;
	// 克隆是页面上的那一份：取景台把整份缩到屏里、挪出视野，克隆上一概不要
	stage.removeAttribute('style');
	stage.style.height = `${content.height}px`;
	// 宽度钉成排出来的那个数：图里没有滚动条，不钉住它就会比排出来的宽出十几像素、折行跟着变
	const pinned = stage.querySelector<HTMLElement>('[data-card]');
	if (pinned) pinned.style.width = `${content.width}px`;
	stage.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

	const css = [...document.querySelectorAll('style')].map((s) => s.textContent ?? '').join('\n');
	// 画的是整个排版视口（三档的判据就是它），裁的只是卡片那一块；
	// 声明成放大后的尺寸、viewBox 不动，装进去的那一份于是照着原样放大，文字与细线因而更实
	const drawn =
		`<svg xmlns="http://www.w3.org/2000/svg" width="${preset.viewport * SCALE}" height="${content.height * SCALE}" viewBox="0 0 ${preset.viewport} ${content.height}">` +
		`<foreignObject width="${preset.viewport}" height="${content.height}">` +
		`<html xmlns="http://www.w3.org/1999/xhtml"><head><style><![CDATA[${css}]]></style></head>` +
		`<body>${new XMLSerializer().serializeToString(stage)}</body></html>` +
		`</foreignObject></svg>`;

	const shot = new Image();
	const svgUrl = URL.createObjectURL(new Blob([drawn], { type: 'image/svg+xml' }));
	await new Promise((done, fail) => {
		shot.onload = done;
		shot.onerror = fail;
		shot.src = svgUrl;
	});
	URL.revokeObjectURL(svgUrl);

	const frame = frameOf(preset.aspect, content);
	// 画布被顶到上限时整幅一起收：卡片与留白同比例，图小一号但版面不变
	const size = Math.min(1, LIMIT / (frame.width * SCALE), LIMIT / (frame.height * SCALE));
	const width = Math.round(frame.width * size * SCALE);
	const height = Math.round(frame.height * size * SCALE);
	// 实拍尺寸与排版视口的比：浏览器给 foreignObject 的固有尺寸未必等于声明的视口，换算一下它才不会被放大
	const ratio = shot.naturalWidth / preset.viewport;

	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('画布开不出来');
	ctx.fillStyle = background;
	ctx.fillRect(0, 0, width, height);
	// 裁的就是卡片那一块：横向居中于视口，所以从它左边那一段起；竖着从顶起（克隆的高度就是它）。
	// 源取实拍上的整张卡片、落点按画布尺寸：上限触发的缩小因此是整幅等比，不是裁掉一块
	const put = { width: content.width * size * SCALE, height: content.height * size * SCALE };
	ctx.drawImage(
		shot,
		left * ratio,
		0,
		content.width * ratio,
		content.height * ratio,
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
