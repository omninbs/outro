import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import { ColophonPage } from './ColophonPage';
import type { CardData } from '../lib/types';

/** 预览页面的逻辑尺寸，再整体等比缩放到预览框里 */
const PAGE_WIDTH = 1280;
const PAGE_HEIGHT = 720;

/** 预览：把同一个页面按固定逻辑尺寸渲染后缩放，与全屏打开看到的一致。 */
export function Preview({ data }: { data: CardData }) {
	const box = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(0);

	useLayoutEffect(() => {
		const el = box.current;
		if (!el) return;
		const fit = () => setScale(el.clientWidth / PAGE_WIDTH);
		fit();
		const observer = new ResizeObserver(fit);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={box}
			class="relative overflow-hidden rounded-lg border border-ctp-surface0"
			style={{ aspectRatio: `${PAGE_WIDTH} / ${PAGE_HEIGHT}` }}
		>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: PAGE_WIDTH,
					height: PAGE_HEIGHT,
					display: 'flex',
					flexDirection: 'column',
					transform: `scale(${scale})`,
					transformOrigin: 'top left',
				}}
			>
				<ColophonPage data={data} />
			</div>
		</div>
	);
}
