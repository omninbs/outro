import type { ComponentChildren } from 'preact';

import { Stepper, type StepDef } from './Stepper';
import { Button } from './ui';

/**
 * 向导骨架：标题、步骤条、两栏。横屏且够宽时右侧常驻清单；
 * 其余情况单栏顺读，需要清单的步骤自己把它放到表单下面。
 * 骨架不关心当前是哪一步，步骤内容由调用方作为 children 传进来。
 */
export function WizardShell({
	steps,
	current,
	onSelect,
	onHome,
	sideList,
	children,
}: {
	steps: StepDef[];
	current: number;
	onSelect: (index: number) => void;
	onHome: () => void;
	sideList: ComponentChildren;
	children: ComponentChildren;
}) {
	// 这里的 w-full 不能省：外层 PageShell 是 flex 列容器，只有 mx-auto 的话，
	// 这一层会按内容宽度收缩，而不是像块级布局那样先占满再用 max-w 截住
	return (
		<div class="mx-auto w-full max-w-360 px-6 py-8">
			<header class="mb-6 flex items-center justify-between gap-4">
				<div class="min-w-0">
					<h1 class="text-lg font-semibold">结尾页生成器</h1>
					<p class="mt-1 text-base text-ctp-subtext0">
						按步骤填写内容，右侧实时确认已填信息，最后生成结尾页
					</p>
				</div>
				<Button class="shrink-0" onClick={onHome}>
					返回首页
				</Button>
			</header>

			<Stepper steps={steps} current={current} onSelect={onSelect} />

			<div class="mt-6 grid items-start gap-6 lg:landscape:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
				<div>{children}</div>

				<div class="hidden lg:landscape:sticky lg:landscape:top-8 lg:landscape:block">{sideList}</div>
			</div>
		</div>
	);
}
