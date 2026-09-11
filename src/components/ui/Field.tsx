import type { ComponentChildren } from 'preact';

/**
 * 带标签的一栏内容，两种包法按里面装什么选：**一个控件**用 `<label>`——点题面就等于点进那个框；
 * **一组选项**不能包——`<label>` 只认第一个「可标记后代」，整块区域的悬停与点击都会算在
 * **第一颗**头上，而那本来就不是「一个控件」，所以那种情况只当一个有名字的组。
 */
export function Field({
	label,
	group,
	children,
}: {
	label: string;
	/** 里面是**一组**选项而不是一个控件时传它：改成一个有名字的组，不包 `<label>` */
	group?: boolean;
	children: ComponentChildren;
}) {
	/* 窄屏外面那层卡片已经横向贴边，标签自己带一次留白才跟框里的文字对齐 */
	const head = <span class="text-base text-ctp-subtext0 narrow:px-inset">{label}</span>;

	if (group) {
		return (
			<div class="flex flex-col gap-1.5" role="group" aria-label={label}>
				{head}
				{children}
			</div>
		);
	}

	return (
		<label class="flex flex-col gap-1.5">
			{head}
			{children}
		</label>
	);
}
