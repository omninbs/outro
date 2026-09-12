import type { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { HOVER } from './tokens';
import { CloseIcon } from './icons';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'dangerSolid';

// 四种变体只在颜色上不同：几何一致（描边宽度也算几何），带描边的两款各减一像素内边距，外高才相同
const VARIANTS: Record<ButtonVariant, string> = {
	primary: 'px-4 py-2 bg-ctp-mauve text-ctp-crust press:opacity-90',
	ghost:
		'border border-ctp-surface1 bg-ctp-text/5 px-[15px] py-[7px] text-ctp-text press:bg-ctp-text/10',
	danger: 'border border-ctp-red px-[15px] py-[7px] text-ctp-red press:bg-ctp-red/10',
	dangerSolid: 'bg-ctp-red px-4 py-2 text-ctp-crust press:opacity-90',
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
			class={`rounded-md text-base font-medium ${HOVER} ${VARIANTS[variant]} ${cls ?? ''} disabled:cursor-not-allowed disabled:opacity-50`}
		>
			{children}
		</button>
	);
}

// 危险动作的二次确认：按钮翻成确认态，再点一下才执行，失焦或超时自动退回
export function ConfirmButton({
	children,
	confirmLabel,
	onConfirm,
	timeoutMs = 3000,
}: {
	children: ComponentChildren;
	confirmLabel: ComponentChildren;
	onConfirm: () => void;
	// 确认态的窗口：失焦与超时都退回
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
			<span role="status" class="sr-only">
				{confirming ? '再点一下确认' : ''}
			</span>
		</Button>
	);
}

// 行尾的删除动作：图标由它自带
export function IconButton({ label, onClick }: { label: string; onClick: () => void }) {
	return (
		<button
			type="button"
			// 图标没有文字，名字只能在这儿给
			aria-label={label}
			title={label}
			onClick={onClick}
			// 反馈只变颜色：它贴在框里，浮出一块底色看着像框里又长出一个按钮
			class={`grid h-8 w-8 shrink-0 place-items-center rounded text-ctp-overlay0 press:text-ctp-red ${HOVER}`}
		>
			<CloseIcon />
		</button>
	);
}
