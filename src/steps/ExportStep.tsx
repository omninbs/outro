import { useState } from 'preact/hooks';
import { Button, Field, Panel, Select } from '../components/ui';
import { RATIOS, SCALES } from '../lib/config';
import { cardSizeOf, copyBlob, downloadBlob, renderPng } from '../lib/export';
import type { CardData, RatioId } from '../lib/types';

export function ExportStep({
	data,
	patch,
	onReset,
}: {
	data: CardData;
	patch: (next: Partial<CardData>) => void;
	onReset: () => void;
}) {
	const [busy, setBusy] = useState(false);
	const [message, setMessage] = useState('');
	const size = cardSizeOf(data);

	const run = async (task: () => Promise<void>, ok: string) => {
		setBusy(true);
		setMessage('');
		try {
			await task();
			setMessage(ok);
		} catch (error) {
			setMessage(error instanceof Error ? error.message : '操作失败');
		} finally {
			setBusy(false);
		}
	};

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

			<Panel title="导出">
				<Field label="导出倍率" hint={`当前输出尺寸 ${size.w} × ${size.h}`}>
					<Select
						value={data.scale}
						options={SCALES.map((s) => ({ value: s.value, label: s.label }))}
						onChange={(scale) => patch({ scale })}
					/>
				</Field>

				<div class="flex flex-wrap gap-2">
					<Button
						variant="primary"
						disabled={busy}
						onClick={() =>
							run(async () => {
								const blob = await renderPng(data);
								downloadBlob(blob, `版权页_${size.w}x${size.h}.png`);
							}, '已导出 PNG')
						}
					>
						导出 PNG
					</Button>
					<Button
						disabled={busy}
						onClick={() =>
							run(async () => {
								const blob = await renderPng(data);
								await copyBlob(blob);
							}, '已复制到剪贴板')
						}
					>
						复制图片
					</Button>
					<Button
						variant="danger"
						disabled={busy}
						onClick={() => {
							if (confirm('确定恢复为默认内容吗？当前填写的内容会丢失。')) onReset();
						}}
					>
						重置
					</Button>
				</div>

				{message && <p class="mt-3 text-xs text-ctp-subtext0">{message}</p>}
			</Panel>
		</>
	);
}
