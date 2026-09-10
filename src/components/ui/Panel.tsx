import type { ComponentChildren } from 'preact';

/** 步骤里的一块内容：标题 + 圆角卡片 */
export function Panel({ title, children }: { title?: string; children: ComponentChildren }) {
	return (
		<section class="rounded-lg border border-ctp-surface0 bg-ctp-mantle p-5">
			{title && <h2 class="mb-4 text-lg font-semibold tracking-wide text-ctp-subtext1">{title}</h2>}
			{children}
		</section>
	);
}
