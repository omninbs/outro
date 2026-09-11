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
 * 在手机上按「横版」存出来的图，跟在大屏上存的是同一张）、**画布的长宽比**（窄 2:3 / 中 1:1 / 宽 3:2）、
 * 以及**边距**：排版区只占画布的一部分，四周留白取排版区较长的那一条的一个比例。
 * 长宽比与边距定死画布：先按留白反推一个刚好装下排版区的画布，再把短的一条撑到长宽比上——
 * 于是比例一定是 2:3 / 1:1 / 3:2，边距只会**更多**、不会被吃掉（内容越长，画布越长）。
 * 留白因此是**下限**，不是定数：内容一多，四周只会更松，这是排版区本身的比例买来的。
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
 * 窄与宽贴着档位线取（30rem / 64rem），而且窄那一个要**站在线里面**：
 * 档位按含滚动条的窗口宽判，取正好的 480 时它反而落到中档那一边。
 */
export const OUTPUTS: OutputPreset[] = [
	{ viewport: 456, aspect: 2 / 3, suffix: '2x3', label: '竖版' },
	{ viewport: 640, aspect: 1, suffix: '1x1', label: '方版' },
	{ viewport: 1148, aspect: 3 / 2, suffix: '3x2', label: '横版' },
];

/** 四周留白的下限：排版区最长边的这个比例那一边至少这么宽 */
const MARGIN = 1 / 16;

/** 画布边长上限：浏览器画布有上限，太大的也发不出去；按长边收到这个数 */
const LIMIT = 2160;

/**
 * 画布定法：先把排版区按留白那圈撑开，再看长宽比——短的一条由长的一条与比例决定，
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
 * 宽度不量、直接取 `preset.viewport`：台子已经把排版区钉成这个数，
 * 量出来的只会是同一个值，写死就少一处会跟窗口走的数。
 */
export async function saveImage(card: HTMLElement, preset: OutputPreset, title: string) {
	const box = { width: preset.viewport, height: card.offsetHeight };
	const shell = card.closest('.safe-area') ?? card;
	const background = getComputedStyle(shell).backgroundColor;

	const stage = shell.cloneNode(true) as HTMLElement;
	// 克隆是页面上的那一份：取景台把整份缩到屏里、挪出视野，克隆上一概不要
	stage.removeAttribute('style');
	stage.style.height = `${box.height}px`;
	// 宽度钉成排出来的那个数：图里没有滚动条，不钉住它就会比排出来的宽出十几像素、折行跟着变
	const pinned = stage.querySelector<HTMLElement>('[data-card]');
	if (pinned) pinned.style.width = `${box.width}px`;
	stage.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

	const css = [...document.querySelectorAll('style')].map((s) => s.textContent ?? '').join('\n');
	// 视口就是排版区那一个：三档的判据是它。高度只用到排版区那么高，底下没有别的东西
	const drawn =
		`<svg xmlns="http://www.w3.org/2000/svg" width="${box.width}" height="${box.height}" viewBox="0 0 ${box.width} ${box.height}">` +
		`<foreignObject width="${box.width}" height="${box.height}">` +
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

	const frame = frameOf(preset.aspect, box);
	// 画布被顶到上限时整幅一起收：排版区与留白同比例，图小一号但版面不变
	const size = Math.min(1, LIMIT / frame.width, LIMIT / frame.height);
	const width = Math.round(frame.width * size);
	const height = Math.round(frame.height * size);
	// 浏览器给 foreignObject 的固有尺寸未必等于声明的视口，按实拍与排版的比换算，排版区在图里就不会被放大
	const ratio = shot.naturalWidth / box.width;

	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('画布开不出来');
	ctx.fillStyle = background;
	ctx.fillRect(0, 0, width, height);
	// 裁的就是排版区那一块：横竖都摆在正中
	const put = { width: box.width * size, height: box.height * size };
	ctx.drawImage(
		shot,
		0,
		0,
		put.width / ratio,
		put.height / ratio,
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
