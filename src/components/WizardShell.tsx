import type { ComponentChildren } from 'preact';

import { COPY } from '../lib/copy';
import { PageHeader } from './PageHeader';
import { Stepper, type StepDef } from './Stepper';
import { FADE } from './ui';

/**
 * 向导骨架：标题、步骤条、两栏——宽档右侧常驻清单，更窄的档单栏顺读，需要清单的步骤自己放到表单下面。
 * 分栏只看宽度、不看比例（比例那套会在「窄而横」的窗口上误分栏）；骨架不关心当前是哪一步。
 * 步骤内容由调用方传进来，定宽与留白由 PageShell 给。
 */
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

			{/* 两栏就是「一行」，用一维排布分比例：清单是给人扫一眼的，正文那栏要更宽。
			    每一列都必须能收缩——控件天生的固有宽度会把整行顶出屏幕。
			    把几列对齐到顶部只在并排那一档写：上下排时它管的是横向，会把子项缩成内容宽 */}
			<div class="flex flex-col gap-6 wide:flex-row wide:items-start">
				<div class="flex min-w-0 flex-col gap-6 wide:flex-[1]">{children}</div>

				{/* 清单在宽档才出现，所以它吸顶的位置得跟容器顶对齐，滚动时看着才是同一层。
				    列数变化插不了值，于是出现与消失只能淡一下，不能硬蹦 */}
				<div
					class={`hidden min-w-0 opacity-0 wide:sticky wide:top-12 wide:block wide:flex-[1.1] wide:opacity-100 wide:starting:opacity-0 ${FADE}`}
				>
					{sideList}
				</div>
			</div>
		</div>
	);
}
