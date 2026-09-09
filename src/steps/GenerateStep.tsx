import { Button, Panel } from '../components/ui';
import { RATIOS } from '../lib/config';
import type { CardData, RatioId } from '../lib/types';

export function GenerateStep({
	data,
	patch,
	onGenerate,
	onReset,
}: {
	data: CardData;
	patch: (next: Partial<CardData>) => void;
	onGenerate: () => void;
	onReset: () => void;
}) {
	return (
		<>
			<Panel title="画布比例">
				<div class="grid grid-cols-3 gap-2 sm:grid-cols-5">
					{RATIOS.map((ratio) => {
						const active = ratio.id === data.ratio;
						return (
							<button
								key={ratio.id}
								type="button"
								onClick={() => patch({ ratio: ratio.id as RatioId })}
								class={`rounded-md border py-2 text-center transition ${
									active
										? 'border-ctp-mauve bg-ctp-surface0 text-ctp-text'
										: 'border-ctp-surface1 text-ctp-subtext0 hover:text-ctp-text'
								}`}
							>
								<span class="block text-sm">{ratio.label}</span>
								<span class="block text-xs opacity-70">{ratio.note}</span>
							</button>
						);
					})}
				</div>
			</Panel>

			<Panel title="生成">
				<p class="mb-4 text-xs leading-relaxed text-ctp-subtext0">
					点击后进入全屏版权页。按 F11 全屏后自行截图即可，页脚左侧的返回链接用于退出。
				</p>
				<div class="flex flex-wrap gap-2">
					<Button variant="primary" onClick={onGenerate}>
						生成
					</Button>
					<Button
						variant="danger"
						onClick={() => {
							if (confirm('确定恢复为默认内容吗？当前填写的内容会丢失。')) onReset();
						}}
					>
						重置
					</Button>
				</div>
			</Panel>
		</>
	);
}
