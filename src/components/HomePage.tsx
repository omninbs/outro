import { SURVEYS } from '../surveys/_registry';
import { COPY } from '../lib/copy';
import type { Survey } from '../lib/survey/types';
import type { CardData } from '../lib/types';
import { PageHeader } from './PageHeader';
import { Panel, SUB_TEXT } from './ui';

/**
 * 首页：把预设铺成一列卡片，整块可点。
 *
 * 清单是数据（surveys/_registry.ts 里的 `SURVEYS`），加一份预设不用碰这里；
 * 每张卡自己说什么时候该出现（`Survey.when`），所以「继续编辑」没有内容时不铺。
 * 容器宽度由 PageShell 给（首页传 width="standard"，与页脚同宽），这里不写 max-w。
 */
export function HomePage({ data, onPick }: { data: CardData; onPick: (survey: Survey) => void }) {
	return (
		<div>
			<PageHeader title={COPY.brand} description="选一种开始方式" />

			<div class="space-y-6">
				{SURVEYS.filter((survey) => !survey.when || survey.when(data)).map((survey) => (
					<Panel key={survey.id} title={survey.title} onClick={() => onPick(survey)}>
						<p class={SUB_TEXT}>{survey.description}</p>
					</Panel>
				))}
			</div>
		</div>
	);
}
