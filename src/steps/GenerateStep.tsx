import { Button, Panel } from '../components/ui';

export function GenerateStep({
	onGenerate,
	onReset,
}: {
	onGenerate: () => void;
	onReset: () => void;
}) {
	return (
		<Panel title="生成">
			<p class="mb-4 text-xs leading-relaxed text-ctp-subtext0">
				点击后进入全屏版权页，内容会铺满整个窗口。按 F11 全屏后自行截图即可，页脚左侧的返回链接用于退出。
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
	);
}
