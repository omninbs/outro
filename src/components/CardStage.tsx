import { useEffect, useMemo, useState } from 'preact/hooks';
import { buildCardHtml } from '../lib/card';
import { ratioOf } from '../lib/config';
import type { CardData } from '../lib/types';

/** 全屏查看版权页：卡片等比铺满视口，页脚左侧是返回入口。 */
export function CardStage({ data, onExit }: { data: CardData; onExit: () => void }) {
	const ratio = ratioOf(data.ratio);
	const [scale, setScale] = useState(1);

	useEffect(() => {
		const update = () =>
			setScale(Math.min(window.innerWidth / ratio.w, window.innerHeight / ratio.h));
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, [ratio.w, ratio.h]);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onExit();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [onExit]);

	const html = useMemo(
		() => buildCardHtml(data, ratio.w, ratio.h, { exitLink: true }),
		[data, ratio.w, ratio.h],
	);

	return (
		<div
			class="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-black"
			onClick={(event) => {
				const target = event.target as HTMLElement | null;
				if (target?.closest('[data-exit]')) onExit();
			}}
		>
			<div
				style={{
					width: `${ratio.w * scale}px`,
					height: `${ratio.h * scale}px`,
					position: 'relative',
				}}
			>
				<div
					style={{
						width: `${ratio.w}px`,
						height: `${ratio.h}px`,
						transformOrigin: 'top left',
						transform: `scale(${scale})`,
					}}
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</div>
		</div>
	);
}
