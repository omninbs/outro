import type { ComponentChildren } from 'preact';

import { COPY } from '../lib/copy';
import { Stepper, type StepDef } from '../components/widgets/Stepper';
import { FADE } from '../components/ui';
import { PageHeader } from './PageHeader';

// 向导骨架：标题、步骤条、两栏；宽档右侧常驻清单，更窄的档单栏顺读
export function WizardShell({
	steps,
	current,
	onSelect,
	sideList,
	children,
}: {
	steps: StepDef[];
	current: number;
	onSelect: (index: number) => void;
	sideList: ComponentChildren;
	children: ComponentChildren;
}) {
	return (
		<div class="flex flex-col gap-6">
			<PageHeader title={COPY.brand} description={COPY.page.wizard} />

			<Stepper steps={steps} current={current} onSelect={onSelect} />

			<div class="flex flex-col gap-6 wide:flex-row wide:items-start">
				<div class="flex min-w-0 flex-col gap-6 wide:flex-[1]">{children}</div>

				<div
					class={`hidden min-w-0 opacity-0 wide:sticky wide:top-12 wide:block wide:flex-[1.1] wide:opacity-100 wide:starting:opacity-0 ${FADE}`}
				>
					{sideList}
				</div>
			</div>
		</div>
	);
}
