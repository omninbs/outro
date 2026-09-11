/**
 * 保存图片：把结尾页那一屏装进 SVG，让浏览器画到一块方形画布上。
 *
 * 装进去的是**页面上那一份**：外壳（卡片与它继承来的那一套）原样克隆，应用的 CSS 一并带上，
 * SVG 的视口宽度取屏幕上那一个——媒体查询、继承、百分比于是都在同一套条件下解，
 * 卡片排出来的东西（含每一处折行）就是屏幕上那一份，不是「另排一份」。搬走的是**条件**，
 * 算仍旧交给浏览器当场算；那种「把每个元素算完的样式读出来、冻死在克隆上」的做法会漂，
 * 正是因为它把一个文档里的计算结果搬到了条件不同的另一个文档里。
 *
 * 方形是量出来的：边长取卡片较长的那一条的两倍，卡片按原尺寸摆在正中。
 * 页面上的控件只占位不印（跟打印同一条规矩）：它们的宽度是排版的一部分，抽掉就会重新折行。
 */
/** 图里「按钮只占位不印」的写法：跟打印那份 `print:invisible` 是同一条规矩的两种落法 */
const NO_BUTTONS = '[&_button]:invisible';

/** 文件名拿标题当名字：存下来的图多半是照标题认的；标题空着就叫「结尾页」 */
function fileName(title: string) {
	return `${title.trim().replace(/[\\/:*?"<>|]/g, '').slice(0, 60) || '结尾页'}.png`;
}

/** 卡片是 `card`；外壳、以及图里要拿掉的控件，都从它身上找 */
export async function saveImage(card: HTMLElement, title: string) {
	const box = card.getBoundingClientRect();
	const side = 2 * Math.ceil(Math.max(box.width, box.height));
	const tall = Math.ceil(box.height);
	const shell = card.closest('.safe-area') ?? card;
	const background = getComputedStyle(shell).backgroundColor;

	const stage = shell.cloneNode(true) as HTMLElement;
	stage.classList.add(NO_BUTTONS);
	stage.style.height = `${box.height}px`;
	// 宽度钉成屏幕上量到的那个数：图里没有滚动条，不钉住它就会比屏幕上宽出十几像素、折行跟着变
	const pinned = stage.querySelector<HTMLElement>('[data-card]');
	if (pinned) pinned.style.width = `${box.width}px`;
	for (const chrome of stage.querySelectorAll('[data-chrome]')) chrome.remove();
	stage.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

	const css = [...document.querySelectorAll('style')].map((s) => s.textContent ?? '').join('\n');
	// 视口取屏幕上那个宽度：三档的判据就是它。高度只用到卡片那么高，底下没有别的东西
	const viewport = window.innerWidth;
	const svg =
		`<svg xmlns="http://www.w3.org/2000/svg" width="${viewport}" height="${tall}" viewBox="0 0 ${viewport} ${tall}">` +
		`<foreignObject width="${viewport}" height="${tall}">` +
		`<html xmlns="http://www.w3.org/1999/xhtml"><head><style><![CDATA[${css}]]></style></head>` +
		`<body>${new XMLSerializer().serializeToString(stage)}</body></html>` +
		`</foreignObject></svg>`;

	const shot = new Image();
	const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
	await new Promise((done, fail) => {
		shot.onload = done;
		shot.onerror = fail;
		shot.src = svgUrl;
	});
	URL.revokeObjectURL(svgUrl);

	const canvas = document.createElement('canvas');
	canvas.width = side;
	canvas.height = side;
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('画布开不出来');
	ctx.fillStyle = background;
	ctx.fillRect(0, 0, side, side);
	// 裁的就是卡片那一块：横向居中，纵向从 0 起
	ctx.drawImage(
		shot,
		(viewport - box.width) / 2,
		0,
		box.width,
		box.height,
		Math.round((side - box.width) / 2),
		Math.round((side - box.height) / 2),
		box.width,
		box.height,
	);

	const blob = await new Promise<Blob | null>((done) => canvas.toBlob(done, 'image/png'));
	if (!blob) throw new Error('图片存不下来');

	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);
	link.href = url;
	link.download = fileName(title);
	link.click();
	// 浏览器还要把 blob 读走，地址晚一步再放掉
	setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
