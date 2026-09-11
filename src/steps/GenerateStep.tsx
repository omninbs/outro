import { useEffect, useRef, useState } from 'preact/hooks';

import { OutroPage } from '../components/OutroPage';
import { PageShell } from '../components/PageShell';
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
	// 存图要有一份排好版的卡片才量得出来，而排的这过程不该被人看见：点一下才把结尾页挂在屏幕外，存完就收
	const [saving, setSaving] = useState(false);
	const [failed, setFailed] = useState(false);
	const stage = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const card = stage.current?.querySelector<HTMLElement>('[data-card]');
		if (!saving || !card) return;
		saveImage(card, data.title).then(
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
				点「生成」进入结尾页，那一屏点哪儿都能回来；也可以直接「保存为图片」，存下一张方形的图。
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

			{/* 取景台：把结尾页原样挂在屏幕外（往左整屏挪开，左侧溢出不会长出滚动条），宽度仍是整屏——
			   档位、继承、量到的宽度都跟屏幕上那一份同条件，所以拍出来的就是它。它只在保存的那一下存在 */}
			{saving && (
				<div ref={stage} aria-hidden="true" class="pointer-events-none fixed top-0 -left-[100vw] w-screen">
					<PageShell theme="latte" width={null} footer={false}>
						<OutroPage data={data} />
					</PageShell>
				</div>
			)}
		</Panel>
	);
}
