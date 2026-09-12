import { useEffect, useRef } from 'preact/hooks';

import { OutroPage } from './outro_page';
import { PageShell } from './page_shell';
import type { OutputPreset } from '../lib/image';
import type { CardData } from '../lib/types';

// 取景台：把结尾页按 preset.viewport 的宽度排一份，供 save_image 装进画布
export function Stage({ preset, data, on_card }: { preset: OutputPreset; data: CardData; on_card: (card: HTMLElement) => void }) {
	const root = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const card = root.current?.querySelector<HTMLElement>('[data-card]');
		if (card) on_card(card);
	}, [on_card]);

	// 缩放比取两头的较小者：整份要放得进视口，缩放后的横向宽高又得撑得住祖先的溢出区
	const fit = Math.min(1, (window.innerWidth - 1) / preset.viewport, 300 / preset.viewport, 300 / window.innerHeight);

	return (
		<div
			ref={root}
			aria-hidden="true"
			class="pointer-events-none fixed top-0 left-0 -translate-x-full -translate-y-full"
			style={{ overflow: 'hidden', width: `${preset.viewport}px`, transform: `scale(${fit})` }}
		>
			<PageShell theme="latte" width={null} footer={false}>
				<OutroPage data={data} />
			</PageShell>
		</div>
	);
}
