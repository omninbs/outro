import type { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'dangerSolid';

/**
 * 内边距写进变体里，是为了把描边宽度从内边距里扣掉：
 * 文字行高 24px，四舍五入后四种变体的外部高度都是 40px，并排时严丝合缝。
 *
 * ghost 的底色用「文字色 5% 淡洗」而不是 surface0：surface0 在亮色（latte）下比底色深一大截、
 * 在暗色（mocha）下反而比底色浅，同一个 token 两边深浅相反，做浅灰按钮总有一边发脏。
 * 淡洗则自动跟着底色走：亮色里变淡灰、暗色里变淡亮，永远只是「比页面略深/略亮一点」。
 */
const VARIANTS: Record<ButtonVariant, string> = {
	primary: 'px-4 py-2 bg-ctp-mauve text-ctp-crust hover:opacity-90',
	ghost:
		'border border-ctp-surface1 bg-ctp-text/5 px-[15px] py-[7px] text-ctp-text hover:bg-ctp-text/10',
	danger: 'border-2 border-ctp-red px-3.5 py-1.5 text-ctp-red hover:bg-ctp-red/10',
	dangerSolid: 'bg-ctp-red px-4 py-2 text-ctp-crust hover:opacity-90',
};

export function Button({
	children,
	onClick,
	onBlur,
	variant = 'ghost',
	disabled,
	class: cls,
}: {
	children: ComponentChildren;
	onClick?: () => void;
	onBlur?: () => void;
	variant?: ButtonVariant;
	disabled?: boolean;
	class?: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			onBlur={onBlur}
			disabled={disabled}
			class={`rounded-md text-base font-medium transition ${VARIANTS[variant]} ${cls ?? ''} disabled:cursor-not-allowed disabled:opacity-50`}
		>
			{children}
		</button>
	);
}

/**
 * 危险操作的二次确认按钮：第一下先把按钮变成实心红并换成确认文案，
 * 再点一下才真的执行；失焦或超过 timeoutMs 没动作就自动收回。
 */
export function ConfirmButton({
	children,
	confirmLabel,
	onConfirm,
	timeoutMs = 1000,
}: {
	children: ComponentChildren;
	confirmLabel: ComponentChildren;
	onConfirm: () => void;
	timeoutMs?: number;
}) {
	const [confirming, setConfirming] = useState(false);

	useEffect(() => {
		if (!confirming) return;
		const timer = setTimeout(() => setConfirming(false), timeoutMs);
		return () => clearTimeout(timer);
	}, [confirming, timeoutMs]);

	return (
		<Button
			variant={confirming ? 'dangerSolid' : 'danger'}
			onClick={() => {
				if (!confirming) {
					setConfirming(true);
					return;
				}
				setConfirming(false);
				onConfirm();
			}}
			onBlur={() => setConfirming(false)}
		>
			{confirming ? confirmLabel : children}
		</Button>
	);
}

/** 列表行尾的图标按钮，目前只有删除（×） */
export function IconButton({
	title,
	onClick,
	children,
}: {
	title: string;
	onClick: () => void;
	children: ComponentChildren;
}) {
	return (
		<button
			type="button"
			title={title}
			onClick={onClick}
			class="grid h-8 w-8 shrink-0 place-items-center rounded text-ctp-overlay0 transition hover:bg-ctp-surface0 hover:text-ctp-red"
		>
			{children}
		</button>
	);
}

/** 列表末尾的虚线添加按钮 */
export function AddButton({ onClick, children }: { onClick: () => void; children: ComponentChildren }) {
	return (
		<button
			type="button"
			onClick={onClick}
			class="w-full rounded-md border border-dashed border-ctp-surface1 py-2 text-base text-ctp-subtext0 transition hover:border-ctp-mauve hover:text-ctp-mauve"
		>
			＋ {children}
		</button>
	);
}

/** 常用条目的小圆按钮 */
export function Chip({ onClick, children }: { onClick: () => void; children: ComponentChildren }) {
	// 描边用 2px：比 1px 立得住，而且 24 + 12 + 4 正好 40px，
	// 与 Button 的四种变体等高，跟别的控件并排时上下边是一条线
	return (
		<button
			type="button"
			onClick={onClick}
			class="rounded-full border-2 border-ctp-surface1 px-3 py-1.5 text-base text-ctp-subtext0 transition hover:border-ctp-mauve hover:text-ctp-mauve"
		>
			{children}
		</button>
	);
}
