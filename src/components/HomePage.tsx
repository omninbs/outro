import { SURVEYS } from '../surveys/_registry';
import { COPY } from '../lib/copy';
import type { Survey } from '../lib/survey/types';
import { PageHeader } from './PageHeader';
import { Panel, SUB_TEXT } from './ui';

/**
 * 首页：把入口铺成一列卡片，整块可点。
 *
 * 清单是数据（surveys/_registry.ts 里的 `SURVEYS`），加一份入口不用碰这里；
 * 第一张固定是「编辑表单」——不用预设、直接进表单的那条路。
 * 容器宽度由 PageShell 给（首页传 width="standard"，与页脚同宽），这里不写 max-w。
 */
export function HomePage({ onPick }: { onPick: (survey: Survey) => void }) {
	return (
		<div>
			<PageHeader title={COPY.brand} description="选一种开始方式" />

			<div class="space-y-6">
				{SURVEYS.map((survey) => (
					<Panel key={survey.id} title={survey.title} onClick={() => onPick(survey)}>
						<p class={SUB_TEXT}>{survey.description}</p>
					</Panel>
				))}
			</div>
		</div>
	);
}
