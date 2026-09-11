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
			<p class="mb-4 text-base leading-relaxed text-ctp-subtext0 max-narrow:px-inset">
				点「生成」进入结尾页：那儿有「保存为图片」，直接存下一张方形的图；也可以全屏截图。
			</p>
			<div class="flex flex-wrap items-center gap-2 max-narrow:px-inset">
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
