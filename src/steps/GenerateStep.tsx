import { Button, Panel } from '../components/ui';

export function GenerateStep({ onReset }: { onReset: () => void }) {
	return (
		<Panel title="生成">
			<p class="mb-4 text-xs leading-relaxed text-ctp-subtext0">
				点击后进入版权页。按 F11 全屏后自行截图即可，页脚左侧的「编辑」可以回到这里。
			</p>
			<div class="flex flex-wrap gap-2">
				<Button variant="primary" href="#/colophon">
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
	);
}
