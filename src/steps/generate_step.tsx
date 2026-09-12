import { useEffect, useState } from 'preact/hooks';

import { Stage } from '../pages/stage';
import { Button, ConfirmButton, Panel } from '../components/ui';
import { COPY } from '../lib/copy';
import { OUTPUTS, save_image, type OutputPreset } from '../lib/image';
import type { CardData } from '../lib/types';

// 一次存图：按哪一档排、图叫什么名字，名字在按下那一刻就定死
type Job = { preset: OutputPreset; title: string };

export function GenerateStep({
	data,
	on_reset,
	on_preview,
}: {
	data: CardData;
	on_reset: () => void;
	on_preview: () => void;
}) {
	// 存图要有一份排好版的卡片才量得出来，而排的这过程不该被人看见：点一下才把结尾页挂在屏幕外，存完就收
	const [job, set_job] = useState<Job | null>(null);
	const [failed, set_failed] = useState(false);
	const [card, set_card] = useState<HTMLElement | null>(null);

	useEffect(() => {
		if (!job || !card) return;
		save_image(card, job.preset, job.title).then(
			() => set_job(null),
			() => {
				set_failed(true);
				set_job(null);
			},
		);
	}, [job, card]);

	return (
		<Panel title={COPY.step.generate}>
			<p class="text-base leading-relaxed text-ctp-subtext0 narrow:px-inset">{COPY.hint.generate}</p>
			<div class="flex flex-col gap-3 narrow:px-inset">
				<div class="flex items-center gap-x-2">
					<Button variant="primary" on_click={on_preview}>
						{COPY.action.preview}
					</Button>
					<ConfirmButton confirm_label={COPY.action.confirm_reset} on_confirm={on_reset}>
						{COPY.action.reset}
					</ConfirmButton>
				</div>
				<div class="flex flex-wrap items-center gap-x-2 gap-y-3">
					{OUTPUTS.map((preset) => (
						<Button
							key={preset.suffix}
							disabled={job !== null}
							on_click={() => {
								set_failed(false);
								set_card(null);
								set_job({ preset, title: data.title });
							}}
						>
							{COPY.action.save}
							{preset.label}
						</Button>
					))}
				</div>
			</div>
			{failed && <p class="text-base text-ctp-red narrow:px-inset">{COPY.hint.save_failed}</p>}

			{job && <Stage preset={job.preset} data={data} on_card={set_card} />}
		</Panel>
	);
}
