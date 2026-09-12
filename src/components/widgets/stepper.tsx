import type { ComponentType } from 'preact';

import { FADE, HOVER, CheckIcon } from '../ui';

export interface StepDef {
	id: string;
	label: string;
	// 这一步的图标由调用方挑，走完的步骤换成勾，靠位置读「第几步」
	icon: ComponentType;
}
export function Stepper({
	steps,
	current,
	on_select,
}: {
	steps: StepDef[];
	current: number;
	on_select: (index: number) => void;
}) {
	return (
		<ol class="flex flex-wrap items-center gap-x-2 gap-y-2 narrow:px-inset">
			{steps.map((step, index) => {
				const active = index === current;
				const done = index < current;
				const Icon = done ? CheckIcon : step.icon;
				const tab = active
					? 'border-ctp-mauve bg-ctp-mauve/10 text-ctp-text'
					: 'border-ctp-surface0 text-ctp-subtext0 press:text-ctp-text';
				const dot = active
					? 'bg-ctp-mauve text-ctp-crust'
					: done
						? 'bg-ctp-green text-ctp-crust'
						: 'bg-ctp-surface1 text-ctp-subtext0';
				return (
					<li key={step.id} class="flex items-center gap-2">
						<button
							type="button"
							aria-current={active ? 'step' : undefined}
							onClick={() => on_select(index)}
							class={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-base ${HOVER} ${tab}`}
						>
							<span class={`grid h-6 w-6 place-items-center rounded-full ${dot}`}>
								<Icon />
							</span>
							<span class={`${active ? '' : 'narrow:hidden narrow:opacity-0'} ${FADE}`}>
								{step.label}
							</span>
						</button>
						{index < steps.length - 1 && <span class="h-px w-4 bg-ctp-surface1" />}
					</li>
				);
			})}
		</ol>
	);
}
