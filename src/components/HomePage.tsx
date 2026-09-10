import { SURVEYS } from '../surveys/_registry';
import { COPY } from '../lib/copy';
import type { Survey } from '../lib/survey/types';
import { PageHeader } from './PageHeader';
import { Panel, SUB_TEXT } from './ui';

/**
 * 首页：把入口铺成一列卡片，整块可点。
 *
 * 问卷清单是数据（surveys/_registry.ts 里的 `SURVEYS`），加一份问卷不用碰这里；
 * 第一份固定是「空预设」——`questions` 为空的那份问卷。
 * 内容非空时，最前面多一张「继续编辑」：它不是一份问卷（不是「开始方式」），
 * 是回到没写完的那份，所以由 app 传进来，不进 `SURVEYS`。
 * 容器宽度由 PageShell 给（首页传 width="standard"，与页脚同宽），这里不写 max-w。
 */
export function HomePage({
	hasDraft,
	onPick,
	onResume,
}: {
	/** 内容里有没有写过东西：有才铺「继续编辑」（见 lib/card 的 `hasContent`） */
	hasDraft: boolean;
	onPick: (survey: Survey) => void;
	onResume: () => void;
}) {
	return (
		<div>
			<PageHeader title={COPY.brand} description="选一种开始方式" />

			<div class="space-y-6">
				{hasDraft && (
					<Panel title="继续编辑" onClick={onResume}>
						<p class={SUB_TEXT}>打开表单接着改：标题、元数据、文本块都还在。</p>
					</Panel>
				)}

				{SURVEYS.map((survey) => (
					<Panel key={survey.id} title={survey.title} onClick={() => onPick(survey)}>
						<p class={SUB_TEXT}>{survey.description}</p>
					</Panel>
				))}
			</div>
		</div>
	);
}
