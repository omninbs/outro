import type { ComponentChildren } from 'preact';

/** 带标签的一栏表单控件 */
export function Field({ label, children }: { label: string; children: ComponentChildren }) {
	return (
		<label class="mb-4 block last:mb-0">
			{/* 窄屏外面那层卡片已经横向贴边，标签自己带一次 inset 才跟框里的文字对齐 */}
			<span class="mb-1.5 block text-base text-ctp-subtext0 max-narrow:px-inset">{label}</span>
			{children}
		</label>
	);
}
