import { SURVEYS } from '../surveys/_registry';
import { COPY } from '../lib/copy';
import type { Survey } from '../lib/survey/types';
import { PageHeader } from './PageHeader';
import { Panel, SUB_TEXT } from './ui';

/**
 * 首页：把入口铺成一列卡片，卡片整块可点——入口清单是数据，加一份不用碰这里。
 * 第一张固定是「编辑表单」：不用预设、直接进表单的那条路。定宽由 PageShell 给，这里不管。
 */
export function HomePage({ onPick }: { onPick: (survey: Survey) => void }) {
	return (
		<div>
			<PageHeader title={COPY.brand} description="选一种编辑向导" />

			<div class="flex flex-col gap-6">
				{SURVEYS.map((survey) => (
					<Panel key={survey.id} title={survey.title} onClick={() => onPick(survey)}>
						<p class={`narrow:px-inset ${SUB_TEXT}`}>{survey.description}</p>
					</Panel>
				))}
			</div>
		</div>
	);
}
