export interface StepDef {
	id: string;
	label: string;
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
		<ol class="flex flex-wrap items-center gap-x-2 gap-y-2">
			{steps.map((step, index) => {
				const active = index === current;
				const done = index < current;
				return (
					<li key={step.id} class="flex items-center gap-2">
						<button
							type="button"
							onClick={() => onSelect(index)}
							class={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-base transition ${
								active
									? 'border-ctp-mauve bg-ctp-mauve/10 text-ctp-text'
									: 'border-ctp-surface0 text-ctp-subtext0 hover:text-ctp-text'
							}`}
						>
							<span
								class={`grid h-6 w-6 place-items-center rounded-full text-base ${
									active
										? 'bg-ctp-mauve text-ctp-crust'
										: done
											? 'bg-ctp-green text-ctp-crust'
											: 'bg-ctp-surface1 text-ctp-subtext0'
								}`}
							>
								{done ? '✓' : index + 1}
							</span>
							{/* 窄屏（宽 ≤ 高）只留序号：未选中的步骤不显示名称，省得步骤条换行 */}
							<span class={active ? '' : 'hidden portrait:inline'}>{step.label}</span>
						</button>
						{index < steps.length - 1 && <span class="h-px w-4 bg-ctp-surface1" />}
					</li>
				);
			})}
		</ol>
	);
}
