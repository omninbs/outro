import { useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import { buildCardHtml } from '../lib/card';
import { ratioOf } from '../lib/config';
import type { CardData } from '../lib/types';

/**
 * 卡片按基准尺寸渲染，再用 transform 缩放到容器宽度，保证预览与导出像素一致。
 */
export function Preview({ data }: { data: CardData }) {
	const box = useRef<HTMLDivElement>(null);
	const ratio = ratioOf(data.ratio);
	const [scale, setScale] = useState(0);

	useLayoutEffect(() => {
		const el = box.current;
		if (!el) return;
		const update = () => setScale(el.clientWidth / ratio.w);
		update();
		const observer = new ResizeObserver(update);
		observer.observe(el);
		return () => observer.disconnect();
	}, [ratio.w]);

	const html = useMemo(() => buildCardHtml(data, ratio.w, ratio.h), [data, ratio.w, ratio.h]);

	return (
		<div
			ref={box}
			class="relative overflow-hidden rounded-lg border border-ctp-surface0 bg-ctp-crust"
			style={{ aspectRatio: `${ratio.w} / ${ratio.h}` }}
		>
			<div
				class="absolute left-0 top-0 origin-top-left"
				style={{
					width: `${ratio.w}px`,
					height: `${ratio.h}px`,
					transform: `scale(${scale})`,
				}}
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
}
