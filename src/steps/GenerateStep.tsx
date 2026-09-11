import { useEffect, useRef, useState } from 'preact/hooks';

import { OutroPage } from '../components/OutroPage';
import { Button, ConfirmButton, Panel } from '../components/ui';
import { COPY } from '../lib/copy';
import { saveImage } from '../lib/image';
import type { CardData } from '../lib/types';

export function GenerateStep({
	data,
	onReset,
	onGenerate,
}: {
	data: CardData;
	onReset: () => void;
	onGenerate: () => void;
}) {
	// 图片得先把版面排一遍才量得出来，而排的这过程不该被人看见：点一下才挂上取景台，存完就收
	const [saving, setSaving] = useState(false);
	const [failed, setFailed] = useState(false);
	const canvas = useRef<HTMLDivElement>(null);
	const board = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const canvasEl = canvas.current;
		const boardEl = board.current;
		if (!saving || !canvasEl || !boardEl) return;
		saveImage(boardEl, canvasEl, data.title).then(
			() => setSaving(false),
			() => {
				setFailed(true);
				setSaving(false);
			},
		);
	}, [saving]);

	return (
		<Panel title={COPY.step.generate}>
			<p class="mb-4 text-base leading-relaxed text-ctp-subtext0 max-narrow:px-inset">
				点「生成」进入结尾页，在那儿全屏截图即可，页脚里的「返回编辑」可以回到这里；「保存为图片」不必进去，直接存下一张方形的图。
			</p>
			<div class="flex flex-wrap items-center gap-2 max-narrow:px-inset">
				<Button variant="primary" onClick={onGenerate}>
					{COPY.action.generate}
				</Button>
				<Button
					disabled={saving}
					onClick={() => {
						setFailed(false);
						setSaving(true);
					}}
				>
					{COPY.action.save}
				</Button>
				<ConfirmButton confirmLabel={COPY.action.confirmReset} onConfirm={onReset}>
					{COPY.action.reset}
				</ConfirmButton>
			</div>
			{failed && <p class="mt-3 text-base text-ctp-red max-narrow:px-inset">存不下来，这个浏览器画不出图片。</p>}

			{/* 取景台：挂在屏幕外（往左整屏挪开，左侧溢出不会长出滚动条；挪的距离与宽度取同一个数，
			   不然它会露出一条边），宽度仍是整屏——跟档位判断同一个基准，所以拍下来的就是这一档的
			   版面，也不吃所在页面有没有滚动条。它只在保存的那一下存在 */}
			{saving && (
				<div class="pointer-events-none fixed top-0 -left-[100vw] w-screen">
					<div ref={canvas} class="flex flex-col latte bg-ctp-base text-ctp-text antialiased">
						<OutroPage data={data} boardRef={board} />
					</div>
				</div>
			)}
		</Panel>
	);
}
