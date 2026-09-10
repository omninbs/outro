import { SURVEYS } from '../lib/survey/registry';
import type { Survey } from '../lib/survey/types';
import { Panel } from './ui';

/**
 * 首页：把问卷清单铺成一列卡片，整块可点。
 *
 * 清单是数据（registry 里的 `SURVEYS`），加一份问卷不用碰这里；
 * 第一份固定是「空预设」——`questions` 为空的那份问卷。
 * 容器宽度由 PageShell 给（首页传 width="standard"，与页脚同宽），这里不写 max-w。
 */
export function HomePage({ onPick }: { onPick: (survey: Survey) => void }) {
	return (
		<div>
			<header class="mb-6">
				<h1 class="text-lg font-semibold">结尾页生成器</h1>
				<p class="mt-1 text-base text-ctp-subtext0">选一种开始方式</p>
			</header>

			<div class="space-y-6">
				{SURVEYS.map((survey) => (
					<Panel key={survey.id} title={survey.title} onClick={() => onPick(survey)}>
						<p class="text-base leading-relaxed text-ctp-subtext0">{survey.description}</p>
					</Panel>
				))}
			</div>
		</div>
	);
}
