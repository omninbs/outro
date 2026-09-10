import type { ComponentChildren } from 'preact';

import { COPY } from '../lib/copy';
import { PageHeader } from './PageHeader';
import { Stepper, type StepDef } from './Stepper';
import { FADE } from './ui';

/**
 * 向导骨架：标题、步骤条、两栏。大屏（`wide:`，宽 ≥ 64rem）右侧常驻清单；
 * 中型及以下单栏顺读，需要清单的步骤自己把它放到表单下面。
 * 分栏只看宽度，不看窗口的比例——比例那套会在「窄而横」的窗口上误分栏。
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
			<PageHeader
				title={COPY.brand}
				description="按步骤填写内容，最后生成结尾页"
			/>

			<Stepper steps={steps} current={current} onSelect={onSelect} />

			{/* 两栏就是「一行」，所以用 flex 分比例（右栏窄一点：清单是给人扫一眼的，正文那栏要宽）。
			    每一列都必须写 `min-w-0`：flex 项默认 `min-width: auto`，会按内容撑开、不收缩——
			    裸输入框天生的固有宽度（400px 出头）会把整行顶出屏幕（2026-09 那条 485px 溢出就是这么来的，
			    当时是 grid，靠 `minmax(0,1fr)` 干同一件事。
			    另外 `items-start` 只写在 `wide:`：列方向上的 `items-*` 是横向对齐，会把子项缩成内容宽 */}
			<div class="mt-6 flex flex-col gap-6 wide:flex-row wide:items-start">
				<div class="min-w-0 wide:flex-[1]">{children}</div>

				{/* top-12 跟 PageShell 的 py-12 对齐，滚动时清单顶部与容器顶部同高。
				    列数变化插不了值，所以它在中屏不摆着（opacity-0）、到大屏是淡进来的，
				    退回去时也是淡出去的，不是硬蹦 */}
				<div
					class={`hidden min-w-0 opacity-0 wide:sticky wide:top-12 wide:block wide:flex-[1.1] wide:opacity-100 wide:starting:opacity-0 ${FADE}`}
				>
					{sideList}
				</div>
			</div>
		</div>
	);
}
