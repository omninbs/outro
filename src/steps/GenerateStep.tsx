import { useEffect, useState } from 'preact/hooks';

import { Stage } from '../components/Stage';
import { Button, ConfirmButton, Panel } from '../components/ui';
import { COPY } from '../lib/copy';
import { OUTPUTS, saveImage, type OutputPreset } from '../lib/image';
import type { CardData } from '../lib/types';

// 一次存图：按哪一档排、图叫什么名字，名字在按下那一刻就定死
type Job = { preset: OutputPreset; title: string };

export function GenerateStep({
	data,
	onReset,
	onPreview,
}: {
	data: CardData;
	onReset: () => void;
	onPreview: () => void;
}) {
	// 存图要有一份排好版的卡片才量得出来，而排的这过程不该被人看见：点一下才把结尾页挂在屏幕外，存完就收
	const [job, setJob] = useState<Job | null>(null);
	const [failed, setFailed] = useState(false);
	const [card, setCard] = useState<HTMLElement | null>(null);

	useEffect(() => {
		if (!job || !card) return;
		saveImage(card, job.preset, job.title).then(
			() => setJob(null),
			() => {
				setFailed(true);
				setJob(null);
			},
		);
	}, [job, card]);

	return (
		<Panel title={COPY.step.generate}>
			<p class="text-base leading-relaxed text-ctp-subtext0 narrow:px-inset">{COPY.hint.generate}</p>
			<div class="flex flex-col gap-3 narrow:px-inset">
				<div class="flex items-center gap-x-2">
					<Button variant="primary" onClick={onPreview}>
						{COPY.action.preview}
					</Button>
					<ConfirmButton confirmLabel={COPY.action.confirmReset} onConfirm={onReset}>
						{COPY.action.reset}
					</ConfirmButton>
				</div>
				<div class="flex flex-wrap items-center gap-x-2 gap-y-3">
					{OUTPUTS.map((preset) => (
						<Button
							key={preset.suffix}
							disabled={job !== null}
							onClick={() => {
								setFailed(false);
								setCard(null);
								setJob({ preset, title: data.title });
							}}
						>
							{COPY.action.save}
							{preset.label}
						</Button>
					))}
				</div>
			</div>
			{failed && <p class="text-base text-ctp-red narrow:px-inset">{COPY.hint.saveFailed}</p>}

			{job && <Stage preset={job.preset} data={data} onCard={setCard} />}
		</Panel>
	);
}
