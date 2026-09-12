// 画布怎么定：纯几何，只吃数字、吐数字，成品的边距与长宽比在这里定死。

// 四周留白的下限：拍下来那一块最长边的这个比例那一边至少这么宽
const MARGIN = 1 / 4;

// 画布定法：先按留白撑开那一块，再把短的一条撑到长宽比上，留白是下限不是定数。
export function frameOf(aspect: number, box: { width: number; height: number }) {
	const spread = 2 * MARGIN * Math.max(box.width, box.height);
	const wide = box.width + spread;
	const high = box.height + spread;
	return wide >= high * aspect ? { width: wide, height: wide / aspect } : { width: high * aspect, height: high };
}
