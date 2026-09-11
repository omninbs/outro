import type { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { HOVER } from './tokens';
import { CloseIcon, PlusIcon } from './icons';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'dangerSolid';

/**
 * 内边距写进变体里，是为了把描边宽度从内边距里扣掉：
 * 文字行高 24px，四种变体的外部高度都是 40px、横向那圈也都是 32px，并排时严丝合缝。
 * **描边一律 1px**：有描边的（`ghost` / `danger`）是 `1px + px-[15px] py-[7px]`，
 * 没描边的（`primary` / `dangerSolid`）是 `px-4 py-2`——四种变体的差别只在颜色。
 * 2026-09 用户提的：`danger` 原来是 `border-2`，一排按钮里就它一个粗边，
 * 看着像另一种东西（几何量没有区别，纯粹是那根线的粗细在作怪）。
 *
 * ghost 的底色用「文字色 5% 淡洗」而不是 surface0：surface0 在亮色（latte）下比底色深一大截、
 * 在暗色（mocha）下反而比底色浅，同一个 token 两边深浅相反，做浅灰按钮总有一边发脏。
 * 淡洗则自动跟着底色走：亮色里变淡灰、暗色里变淡亮，永远只是「比页面略深/略亮一点」。
 */
const VARIANTS: Record<ButtonVariant, string> = {
	primary: 'px-4 py-2 bg-ctp-mauve text-ctp-crust hover:opacity-90',
	ghost:
		'border border-ctp-surface1 bg-ctp-text/5 px-[15px] py-[7px] text-ctp-text hover:bg-ctp-text/10',
	danger: 'border border-ctp-red px-[15px] py-[7px] text-ctp-red hover:bg-ctp-red/10',
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
			class={`rounded-md text-base font-medium ${HOVER} ${VARIANTS[variant]} ${cls ?? ''} disabled:cursor-not-allowed disabled:opacity-50`}
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

/** 列表行尾的删除按钮（那颗叉）。图标由它自己带，调用点只说「点它干什么」 */
export function IconButton({ title, onClick }: { title: string; onClick: () => void }) {
	return (
		<button
			type="button"
			title={title}
			onClick={onClick}
			// 悬停只变颜色，不给淡底：它贴在框里，浮出一块底色看着像框里又长出一个按钮
			class={`grid h-8 w-8 shrink-0 place-items-center rounded text-ctp-overlay0 hover:text-ctp-red ${HOVER}`}
		>
			<CloseIcon />
		</button>
	);
}

/** 列表末尾的虚线添加按钮。窄屏跟列表里的条目一个待遇：贴边、去侧边描边与圆角 */
export function AddButton({ onClick, children }: { onClick: () => void; children: ComponentChildren }) {
	return (
		<button
			type="button"
			onClick={onClick}
			// 图标与文字是「一行里的两样东西」，距离由 `gap` 给——原来那个 ＋ 是全角字符，
			// 距离是拿一个空格凑的，换字体就变
			class={`flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-ctp-surface1 py-2 text-base text-ctp-subtext0 hover:border-ctp-mauve hover:text-ctp-mauve max-narrow:rounded-none max-narrow:border-x-0 max-narrow:px-inset ${HOVER}`}
		>
			<PlusIcon />
			{children}
		</button>
	);
}
