import { SURVEYS } from '../surveys/_registry';
import { COPY } from '../lib/copy';
import { PageHeader } from './PageHeader';
import { Panel, SUB_TEXT } from './ui';

// 首页：入口铺成一列卡片、整块可点；清单是数据，加一份不用碰这里
export function HomePage() {
	return (
		<div class="flex flex-col gap-6">
			<PageHeader title={COPY.brand} description={COPY.page.home} />

			<div class="flex flex-col gap-6">
				{SURVEYS.map((survey) => (
					<Panel key={survey.id} title={survey.title} href={`#${survey.id}`}>
						<p class={`narrow:px-inset ${SUB_TEXT}`}>{survey.description}</p>
					</Panel>
				))}
			</div>
		</div>
	);
}
