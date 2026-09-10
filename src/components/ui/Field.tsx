import type { ComponentChildren } from 'preact';

/**
 * 带标签的一栏内容。
 *
 * 两种包法，按里面装什么选：**一个控件**用 `<label>`（点题面就聚焦进那个框）；
 * **一组选项**不能包——`<label>` 的「可标记后代」只认第一个，于是整块区域（题面、
 * 栏里没按钮的空白、按钮之间的缝）的悬停与点击都算在**第一颗**头上。2026-09 用户就是这么撞上的：
 * 悬停别的选项时第一颗也亮。`.git/probe-hover.mjs` 量到的原样是「指针在栏右端空白 / 按钮缝隙 /
 * 题面上时，第一颗按钮照样 `matches(':hover')`，指针在第二颗上时两颗都算」；
 * 而且点栏里的空白会直接选中第一颗——那本来就不是「一个控件」，
 * 也就不该有「点标签等于点它」这回事，所以那种情况只当一个有名字的组。
 */
export function Field({
	label,
	group,
	children,
}: {
	label: string;
	/** 里面是**一组**选项（不是一个控件）时传它：不包 `<label>`，改成一个有名字的组 */
	group?: boolean;
	children: ComponentChildren;
}) {
	/* 窄屏外面那层卡片已经横向贴边，标签自己带一次 inset 才跟框里的文字对齐 */
	const head = <span class="mb-1.5 block text-base text-ctp-subtext0 max-narrow:px-inset">{label}</span>;

	if (group) {
		return (
			<div class="mb-4 last:mb-0" role="group" aria-label={label}>
				{head}
				{children}
			</div>
		);
	}

	return (
		<label class="mb-4 block last:mb-0">
			{head}
			{children}
		</label>
	);
}
