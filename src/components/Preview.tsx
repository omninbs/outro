import { CardPage } from './CardPage';
import type { CardData } from '../lib/types';

/** 预览：与全屏生成用同一个页面组件，只是容器小。 */
export function Preview({ data }: { data: CardData }) {
	return (
		<div
			class="relative overflow-hidden rounded-lg border border-ctp-surface0"
			style={{ aspectRatio: '16 / 9' }}
		>
			<CardPage data={data} />
		</div>
	);
}
