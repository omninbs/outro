import { useEffect, useState } from 'preact/hooks';

import { Stage } from '../components/Stage';
import { Button, ConfirmButton, Panel } from '../components/ui';
import { COPY } from '../lib/copy';
import { OUTPUTS, saveImage, type OutputPreset } from '../lib/image';
import type { CardData } from '../lib/types';

/**
 * 一次存图：按哪一档排、图叫什么名字。名字在**按下那一刻**就定死——按钮上写的就是这一档，
 * 图认的也是当时看见的那个标题；排与画都发生在后面几步，不该回头再读一遍会变的东西。
 */
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
			<p class="text-base leading-relaxed text-ctp-subtext0 narrow:px-inset">
				点「预览」看到的就是成品本身，那一屏点哪儿都能回来；存图是下面那三颗，各存一档比例，三种比例各自
				排版，内容四周都留着边距。
			</p>
			{/*
				两行是两件事：「看一眼」与「拿走一张」。行内紧、行间松，人才读得出这是两行——
				两者一样紧时就黏成一片按钮，看着像六颗并列的动作。行与行的距离由外层一次给定，
				不靠一个占满整行的空元素去撑开一行——那样撑出来的空档会算两遍，看着比想要的松。
				行内那点距离跟别处按钮同一档。
			*/}
			<div class="flex flex-col gap-3 narrow:px-inset">
				<div class="flex items-center gap-x-2">
					<Button variant="primary" onClick={onPreview}>
						{COPY.action.preview}
					</Button>
					<ConfirmButton confirmLabel={COPY.action.confirmReset} onConfirm={onReset}>
						{COPY.action.reset}
					</ConfirmButton>
				</div>
				{/* 短按钮是唯一的兜底：窄到放不下就自己折，不留给人看它「什么时候会折」 */}
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
			{failed && <p class="text-base text-ctp-red narrow:px-inset">存不下来，这个浏览器画不出图片。</p>}

			{job && <Stage preset={job.preset} data={data} onCard={setCard} />}
		</Panel>
	);
}
