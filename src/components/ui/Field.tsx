import type { ComponentChildren } from 'preact';

/** 带标签的一栏表单控件 */
export function Field({ label, children }: { label: string; children: ComponentChildren }) {
	return (
		<label class="mb-4 block last:mb-0">
			<span class="mb-1.5 block text-base text-ctp-subtext0">{label}</span>
			{children}
		</label>
	);
}
