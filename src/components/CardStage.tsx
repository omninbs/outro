import { useEffect } from 'preact/hooks';
import { CardPage } from './CardPage';
import type { CardData } from '../lib/types';

/** 全屏查看版权页：页面铺满整个视口，页脚左侧是返回入口。 */
export function CardStage({ data, onExit }: { data: CardData; onExit: () => void }) {
	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onExit();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [onExit]);

	return (
		<div
			class="fixed inset-0 z-50"
			onClick={(event) => {
				const target = event.target as HTMLElement | null;
				if (target?.closest('[data-exit]')) onExit();
			}}
		>
			<CardPage data={data} exitLink />
		</div>
	);
}
