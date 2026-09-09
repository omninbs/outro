import type { ComponentChildren } from 'preact';

const INPUT =
	'w-full rounded-md border border-ctp-surface1 bg-ctp-crust px-3 py-2 text-sm text-ctp-text ' +
	'placeholder:text-ctp-overlay0 focus:border-ctp-mauve focus:outline-none';

export function Panel({ title, children }: { title?: string; children: ComponentChildren }) {
	return (
		<section class="rounded-lg border border-ctp-surface0 bg-ctp-mantle p-5">
			{title && <h2 class="mb-4 text-sm font-semibold tracking-wide text-ctp-subtext1">{title}</h2>}
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
			<span class="mb-1.5 block text-xs text-ctp-subtext0">{label}</span>
			{children}
			{hint && <span class="mt-1.5 block text-xs text-ctp-overlay0">{hint}</span>}
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

type ButtonVariant = 'primary' | 'ghost' | 'danger';

const VARIANTS: Record<ButtonVariant, string> = {
	primary: 'bg-ctp-mauve text-ctp-crust hover:opacity-90',
	ghost: 'border border-ctp-surface1 bg-ctp-surface0 text-ctp-text hover:bg-ctp-surface1',
	danger: 'border border-ctp-surface1 text-ctp-subtext0 hover:border-ctp-red hover:text-ctp-red',
};

export function Button({
	children,
	onClick,
	href,
	variant = 'ghost',
	disabled,
	class: cls,
}: {
	children: ComponentChildren;
	onClick?: () => void;
	href?: string;
	variant?: ButtonVariant;
	disabled?: boolean;
	class?: string;
}) {
	const base = `rounded-md px-4 py-2 text-sm font-medium transition ${VARIANTS[variant]} ${cls ?? ''}`;

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
			disabled={disabled}
			class={`disabled:cursor-not-allowed disabled:opacity-50 ${base}`}
		>
			{children}
		</button>
	);
}
