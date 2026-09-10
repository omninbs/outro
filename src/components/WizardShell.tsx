import type { ComponentChildren } from 'preact';

import { Stepper, type StepDef } from './Stepper';

/**
 * 向导骨架：标题、步骤条、两栏。横屏且够宽时右侧常驻清单；
 * 其余情况单栏顺读，需要清单的步骤自己把它放到表单下面。
 * 骨架不关心当前是哪一步，步骤内容由调用方作为 children 传进来。
 * 容器宽度与内边距由 PageShell 给，这里不再写 max-w 与 px。
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
		<div>
			<header class="mb-6">
				<h1 class="text-lg font-semibold">结尾页生成器</h1>
				<p class="mt-1 text-base text-ctp-subtext0">
					按步骤填写内容，右侧实时确认已填信息，最后生成结尾页
				</p>
			</header>

			<Stepper steps={steps} current={current} onSelect={onSelect} />

			<div class="mt-6 grid items-start gap-6 lg:landscape:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
				<div>{children}</div>

				{/* top-12 跟 PageShell 的 py-12 对齐，滚动时清单顶部与容器顶部同高 */}
				<div class="hidden lg:landscape:sticky lg:landscape:top-12 lg:landscape:block">{sideList}</div>
			</div>
		</div>
	);
}
