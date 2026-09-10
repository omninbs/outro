import { Button, ConfirmButton, Panel } from '../components/ui';
import { COPY } from '../lib/copy';

export function GenerateStep({
	onReset,
	onGenerate,
}: {
	onReset: () => void;
	onGenerate: () => void;
}) {
	return (
		<Panel title={COPY.step.generate}>
			<p class="mb-4 text-base leading-relaxed text-ctp-subtext0">
				点击后进入结尾页。按 F11 全屏后自行截图即可，页脚左侧的「返回编辑」可以回到这里。
			</p>
			<div class="flex flex-wrap items-center gap-2">
				<Button variant="primary" onClick={onGenerate}>
					{COPY.action.generate}
				</Button>
				<ConfirmButton confirmLabel={COPY.action.confirmReset} onConfirm={onReset}>
					{COPY.action.reset}
				</ConfirmButton>
			</div>
		</Panel>
	);
}
