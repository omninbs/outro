import { toBlob } from 'html-to-image';

/**
 * 保存图片：把「版面」翻拍成一张方形的图。
 *
 * 它是**同一个版面的翻拍**，不是另画一张——量到的就是屏幕上那一版，所以三档各是什么样，
 * 存下来就是什么样，也不会跟屏幕上的排版悄悄走散。
 *
 * 方形是量出来的：**边长取内容最长边的两倍**，内容按原尺寸摆在正中，四周于是各留出半条
 * 最长边的余量。**先量宽、再定方形**——方形比版面宽，尺寸一定下来版面就可能跟着重新排版，
 * 所以量到的那个宽度得先钉在版面上。
 */

/** 文件名拿标题当名字：存下来的图多半是照标题认的；标题空着就叫「结尾页」 */
function fileName(title: string) {
	return `${title.trim().replace(/[\\/:*?"<>|]/g, '').slice(0, 60) || '结尾页'}.png`;
}

/** 版面是 `board`，装它的方形画布是 `canvas`；两个都由取景台交出来 */
export async function saveImage(board: HTMLElement, canvas: HTMLElement, title: string) {
	board.style.width = `${board.getBoundingClientRect().width}px`;

	const { width, height } = board.getBoundingClientRect();
	const side = 2 * Math.ceil(Math.max(width, height));
	canvas.style.width = `${side}px`;
	canvas.style.height = `${side}px`;

	// 内容按原尺寸画（倍率写死 1，不跟设备的像素比走）；字体全是系统的，也不必有内嵌那一步
	const blob = await toBlob(canvas, { pixelRatio: 1, skipFonts: true });
	if (!blob) throw new Error('版面画不成图片');

	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = fileName(title);
	link.click();
	// 浏览器还要把 blob 读走，地址晚一步再放掉
	setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
