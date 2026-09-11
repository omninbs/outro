/**
 * 画布怎么定：纯几何，只吃数字、吐数字——它跟「把结尾页装进 SVG」是两件事，
 * 所以分在两个文件里，也就能单独量（见 `tests/frame.test.ts`）。
 *
 * 成品的边距与长宽比（窄 2:3 / 中 1:1 / 宽 3:2）在这里定死：卡片只占画布的一部分，四周留白
 * 取它较长的那一条的一个比例。先按留白反推一个刚好装下卡片的画布，再把短的一条撑到长宽比上——
 * 于是比例永远是对的，边距只会**更多**、不会被吃掉（内容越长，画布越长）。留白因此是**下限**，
 * 不是定数。
 */

/** 四周留白的下限：拍下来那一块最长边的这个比例那一边至少这么宽 */
const MARGIN = 1 / 4;

/**
 * 画布定法：先把那一块按留白那圈撑开，再看长宽比——短的一条由长的一条与比例决定，
 * 所以比例永远是对的，长的那一条那两侧的留白恰好是那圈，短的两侧只会更宽。
 */
export function frameOf(aspect: number, box: { width: number; height: number }) {
	const spread = 2 * MARGIN * Math.max(box.width, box.height);
	const wide = box.width + spread;
	const high = box.height + spread;
	return wide >= high * aspect ? { width: wide, height: wide / aspect } : { width: high * aspect, height: high };
}
