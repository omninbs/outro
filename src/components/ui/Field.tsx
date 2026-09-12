import type { ComponentChildren } from 'preact';

// 带标签的一栏内容：一个控件用 <label> 包，一组选项只当有名字的组，不能包
export function Field({
	label,
	group,
	children,
}: {
	label: string;
	// 里面是一组选项而不是一个控件时传它
	group?: boolean;
	children: ComponentChildren;
}) {
	// 窄屏外面那层卡片已贴边，标签自己带一次留白才跟框里文字对齐
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
