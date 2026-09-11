import type { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { HOVER } from './tokens';
import { CloseIcon, PlusIcon } from './icons';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'dangerSolid';

/**
 * 四种变体的差别**只在颜色**：几何一律一致，描边粗细也算几何——一排按钮里不能有一个看着像
 * 另一种东西，所以危险动作只靠颜色与文案表达，不给某个变体单独加粗或放大。
 * 中性那颗的底色拿文字色兑出来、不用固定的色阶：固定色阶在亮色主题下比底色深、在暗色主题下
 * 比底色浅，做中性按钮总有一边发脏。
 */
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

/**
 * 危险动作的二次确认：按钮自己翻成确认态（换颜色、换文案），再点一下才真执行，
 * 失焦或搁置一会儿就自动退回——不弹对话框，也就不打断手里的事。
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

/** 行尾的删除动作：图标由它自带，调用点只说「点它干什么」 */
export function IconButton({ label, onClick }: { label: string; onClick: () => void }) {
	return (
		<button
			type="button"
			// 图标没有文字，名字只能在这儿给；`title` 顺带把鼠标悬停时的提示也留上
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

/** 列表末尾的添加动作：虚线框，窄档跟列表里的条目一个待遇（贴边、去侧边描边与圆角） */
export function AddButton({ onClick, children }: { onClick: () => void; children: ComponentChildren }) {
	return (
		<button
			type="button"
			onClick={onClick}
			class={`flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-ctp-surface1 py-2 text-base text-ctp-subtext0 press:border-ctp-mauve press:text-ctp-mauve narrow:rounded-none narrow:border-x-0 narrow:px-inset ${HOVER}`}
		>
			<PlusIcon />
			{children}
		</button>
	);
}
