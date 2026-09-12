import type { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { HOVER } from './tokens';
import { CloseIcon } from './icons';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'danger_solid';

// 四种变体只在颜色上不同：几何一致，外高也就一样
const VARIANTS: Record<ButtonVariant, string> = {
	primary: 'px-4 py-2 bg-ctp-mauve text-ctp-crust press:opacity-90',
	ghost:
		'border border-ctp-surface1 bg-ctp-text/5 px-[15px] py-[7px] text-ctp-text press:bg-ctp-text/10',
	danger: 'border border-ctp-red px-[15px] py-[7px] text-ctp-red press:bg-ctp-red/10',
	danger_solid: 'bg-ctp-red px-4 py-2 text-ctp-crust press:opacity-90',
};

export function Button({
	children,
	on_click,
	on_blur,
	variant = 'ghost',
	disabled,
	class: cls,
}: {
	children: ComponentChildren;
	on_click?: () => void;
	on_blur?: () => void;
	variant?: ButtonVariant;
	disabled?: boolean;
	class?: string;
}) {
	return (
		<button
			type="button"
			onClick={on_click}
			onBlur={on_blur}
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
	confirm_label,
	on_confirm,
	timeout_ms = 3000,
}: {
	children: ComponentChildren;
	confirm_label: ComponentChildren;
	on_confirm: () => void;
	// 确认态的窗口：失焦与超时都退回
	timeout_ms?: number;
}) {
	const [confirming, set_confirming] = useState(false);

	useEffect(() => {
		if (!confirming) return;
		const timer = setTimeout(() => set_confirming(false), timeout_ms);
		return () => clearTimeout(timer);
	}, [confirming, timeout_ms]);

	return (
		<Button
			variant={confirming ? 'danger_solid' : 'danger'}
			on_click={() => {
				if (!confirming) {
					set_confirming(true);
					return;
				}
				set_confirming(false);
				on_confirm();
			}}
			on_blur={() => set_confirming(false)}
		>
			{confirming ? confirm_label : children}
			<span role="status" class="sr-only">
				{confirming ? '再点一下确认' : ''}
			</span>
		</Button>
	);
}

// 行尾的删除动作：图标由它自带
export function IconButton({ label, on_click }: { label: string; on_click: () => void }) {
	// 图标没有文字，名字只能在这儿给；反馈只变颜色——它贴在框里，浮出一块底色像框里又长出一个按钮
	return (
		<button
			type="button"
			aria-label={label}
			title={label}
			onClick={on_click}
			class={`grid h-8 w-8 shrink-0 place-items-center rounded text-ctp-overlay0 press:text-ctp-red ${HOVER}`}
		>
			<CloseIcon />
		</button>
	);
}
