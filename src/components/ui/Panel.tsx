import type { ComponentChildren } from 'preact';

const CARD = 'rounded-lg border border-ctp-surface0 bg-ctp-mantle p-5';

/**
 * 步骤里的一块内容：标题 + 圆角卡片。
 *
 * 给了 onClick 就整块可点——那种卡片本身就是入口（首页选开始方式），
 * 所以里面不该再放按钮：按钮套按钮既不合规，点哪儿都要瞄准一下也不符合直觉。
 */
export function Panel({
	title,
	onClick,
	children,
}: {
	title?: string;
	onClick?: () => void;
	children: ComponentChildren;
}) {
	const head = title && <h2 class="mb-4 text-lg font-semibold tracking-wide text-ctp-subtext1">{title}</h2>;

	if (!onClick) {
		return (
			<section class={CARD}>
				{head}
				{children}
			</section>
		);
	}

	return (
		<button
			type="button"
			onClick={onClick}
			class={`${CARD} block w-full cursor-pointer text-left transition hover:border-ctp-mauve hover:bg-ctp-surface0/40`}
		>
			{head}
			{children}
		</button>
	);
}
