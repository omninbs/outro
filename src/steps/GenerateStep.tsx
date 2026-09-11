import { useEffect, useState } from 'preact/hooks';

import { Stage } from '../components/Stage';
import { Button, ConfirmButton, Panel } from '../components/ui';
import { COPY } from '../lib/copy';
import { OUTPUTS, saveImage, type OutputPreset } from '../lib/image';
import type { CardData } from '../lib/types';

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
	const [job, setJob] = useState<OutputPreset | null>(null);
	const [failed, setFailed] = useState(false);
	const [card, setCard] = useState<HTMLElement | null>(null);

	useEffect(() => {
		if (!job || !card) return;
		saveImage(card, job, data.title).then(
			() => setJob(null),
			() => {
				setFailed(true);
				setJob(null);
			},
		);
	}, [job, card]);

	return (
		<Panel title={COPY.step.generate}>
			<p class="mb-4 text-base leading-relaxed text-ctp-subtext0 max-narrow:px-inset">
				点「预览」看到的就是成品本身，那一屏点哪儿都能回来；存图是下面那三颗，各存一档比例，三种比例各自
				排版，内容四周都留着边距。
			</p>
			<div class="flex flex-col gap-2 max-narrow:px-inset">
				<div class="flex flex-wrap items-center gap-2">
					<Button variant="primary" onClick={onPreview}>
						{COPY.action.preview}
					</Button>
					<ConfirmButton confirmLabel={COPY.action.confirmReset} onConfirm={onReset}>
						{COPY.action.reset}
					</ConfirmButton>
				</div>
				{/* 存图是另一类动作：三颗并成自己的一行，也就分得开「看一眼」与「拿走一张」 */}
				<div class="flex flex-wrap items-center gap-2">
					{OUTPUTS.map((preset) => (
						<Button
							key={preset.suffix}
							disabled={job !== null}
							onClick={() => {
								setFailed(false);
								setCard(null);
								setJob(preset);
							}}
						>
							{COPY.action.save}
							{preset.label}
						</Button>
					))}
				</div>
			</div>
			{failed && <p class="mt-3 text-base text-ctp-red max-narrow:px-inset">存不下来，这个浏览器画不出图片。</p>}

			{job && <Stage preset={job} data={data} onCard={setCard} />}
		</Panel>
	);
}
