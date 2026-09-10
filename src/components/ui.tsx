import type { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';

const INPUT =
	'w-full rounded-md border border-ctp-surface1 bg-ctp-crust px-3 py-2 text-base text-ctp-text ' +
	'placeholder:text-ctp-overlay0 focus:border-ctp-mauve focus:outline-none';

export function Panel({ title, children }: { title?: string; children: ComponentChildren }) {
	return (
		<section class="rounded-lg border border-ctp-surface0 bg-ctp-mantle p-5">
			{title && <h2 class="mb-4 text-lg font-semibold tracking-wide text-ctp-subtext1">{title}</h2>}
			{children}
		</section>
	);
}

export function Field({
	label,
	hint,
	children,
}: {
	label: string;
	hint?: string;
	children: ComponentChildren;
}) {
	return (
		<label class="mb-4 block last:mb-0">
			<span class="mb-1.5 block text-base text-ctp-subtext0">{label}</span>
			{children}
			{hint && <span class="mt-1.5 block text-base text-ctp-overlay0">{hint}</span>}
		</label>
	);
}

export function TextInput({
	value,
	onInput,
	placeholder,
	class: cls,
}: {
	value: string;
	onInput: (value: string) => void;
	placeholder?: string;
	class?: string;
}) {
	return (
		<input
			type="text"
			value={value}
			placeholder={placeholder}
			class={`${INPUT} ${cls ?? ''}`}
			onInput={(e) => onInput(e.currentTarget.value)}
		/>
	);
}

export function TextArea({
	value,
	onInput,
	rows = 6,
	placeholder,
}: {
	value: string;
	onInput: (value: string) => void;
	rows?: number;
	placeholder?: string;
}) {
	return (
		<textarea
			value={value}
			rows={rows}
			placeholder={placeholder}
			class={`${INPUT} resize-y leading-relaxed`}
			onInput={(e) => onInput(e.currentTarget.value)}
		/>
	);
}

export function Select<T extends string | number>({
	value,
	options,
	onChange,
}: {
	value: T;
	options: { value: T; label: string }[];
	onChange: (value: T) => void;
}) {
	return (
		<select
			class={INPUT}
			value={String(value)}
			onChange={(e) => {
				const raw = e.currentTarget.value;
				const hit = options.find((o) => String(o.value) === raw);
				if (hit) onChange(hit.value);
			}}
		>
			{options.map((o) => (
				<option key={String(o.value)} value={String(o.value)}>
					{o.label}
				</option>
			))}
		</select>
	);
}

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'dangerSolid';

/**
 * 内边距写进变体里，是为了把描边宽度从内边距里扣掉：
 * 文字行高 24px，四舍五入后四种变体的外部高度都是 40px，并排时严丝合缝。
 */
const VARIANTS: Record<ButtonVariant, string> = {
	primary: 'px-4 py-2 bg-ctp-mauve text-ctp-crust hover:opacity-90',
	ghost: 'border border-ctp-surface1 bg-ctp-surface0 px-[15px] py-[7px] text-ctp-text hover:bg-ctp-surface1',
	danger: 'border-2 border-ctp-red px-3.5 py-1.5 text-ctp-red hover:bg-ctp-red/10',
	dangerSolid: 'bg-ctp-red px-4 py-2 text-ctp-crust hover:opacity-90',
};

export function Button({
	children,
	onClick,
	onBlur,
	href,
	variant = 'ghost',
	disabled,
	class: cls,
}: {
	children: ComponentChildren;
	onClick?: () => void;
	onBlur?: () => void;
	href?: string;
	variant?: ButtonVariant;
	disabled?: boolean;
	class?: string;
}) {
	const base = `rounded-md text-base font-medium transition ${VARIANTS[variant]} ${cls ?? ''}`;

	if (href) {
		return (
			<a href={href} class={`inline-block ${base}`}>
				{children}
			</a>
		);
	}

	return (
		<button
			type="button"
			onClick={onClick}
			onBlur={onBlur}
			disabled={disabled}
			class={`disabled:cursor-not-allowed disabled:opacity-50 ${base}`}
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
