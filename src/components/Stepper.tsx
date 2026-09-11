import type { ComponentType } from 'preact';

import { FADE, HOVER, CheckIcon } from './ui';

export interface StepDef {
	id: string;
	label: string;
	/**
	 * 这一步在圆里的图标。
	 *
	 * 圆里原来写的是序号（`index + 1`），但那是**字体字符**：用户完全可能把系统默认字体
	 * 换成拼音字体或艺术字，数字就跟着变样。所以这里要的是图形，由调用方给（`STEPS` 里
	 * 按这一步「干什么」挑，比如摘要给 `list`、生成给 `sparkles`）。
	 * 代价是「第几步」得靠位置读——位置本来就是这么读的，完成态也仍旧是那颗勾。
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
		<ol class="flex flex-wrap items-center gap-x-2 gap-y-2 max-narrow:px-inset">
			{steps.map((step, index) => {
				const active = index === current;
				const done = index < current;
				// 走完的步骤是勾，其余是这一步自己的图标
				const Icon = done ? CheckIcon : step.icon;
				return (
					<li key={step.id} class="flex items-center gap-2">
						<button
							type="button"
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
							{/* 窄屏只留图标：未选中的步骤不显示名称，省得步骤条换行。
							    名称出现 / 消失是淡的（FADE），不是啪一下 */}
							<span class={`${active ? '' : 'max-narrow:hidden max-narrow:opacity-0'} ${FADE}`}>
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
