import type { ComponentType } from 'preact';

import { FADE, HOVER, CheckIcon } from './ui';

export interface StepDef {
	id: string;
	label: string;
	/**
	 * 这一步在圆里的图标，由调用方按这一步「干什么」挑；走完的步骤换成勾，
	 * 所以「第几步」靠位置读。要图形不要数字字符——字形由系统字体决定。
	 */
	icon: ComponentType;
}
export function Stepper({
	steps,
	current,
	onSelect,
}: {
	steps: StepDef[];
	current: number;
	onSelect: (index: number) => void;
}) {
	return (
		<ol class="flex flex-wrap items-center gap-x-2 gap-y-2 narrow:px-inset">
			{steps.map((step, index) => {
				const active = index === current;
				const done = index < current;
				const Icon = done ? CheckIcon : step.icon;
				return (
					<li key={step.id} class="flex items-center gap-2">
						<button
							type="button"
							aria-current={active ? 'step' : undefined}
							onClick={() => onSelect(index)}
							class={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-base ${HOVER} ${
								active
									? 'border-ctp-mauve bg-ctp-mauve/10 text-ctp-text'
									: 'border-ctp-surface0 text-ctp-subtext0 press:text-ctp-text'
							}`}
						>
							<span
								class={`grid h-6 w-6 place-items-center rounded-full ${
									active
										? 'bg-ctp-mauve text-ctp-crust'
										: done
											? 'bg-ctp-green text-ctp-crust'
											: 'bg-ctp-surface1 text-ctp-subtext0'
								}`}
							>
								<Icon />
							</span>
							{/* 窄屏只留图标：名称会把这排东西挤到换行；出现与消失是淡的，不硬蹦 */}
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
