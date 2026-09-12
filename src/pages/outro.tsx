import { OutroPage } from '../components/OutroPage';
import { PageShell } from '../components/PageShell';
import { lastStepName } from '../steps/_registry';
import type { Page } from './_registry';

// 预览页：拿去截图的那一屏，点任意处退回向导最后一步
export const OUTRO_PAGE: Page = {
	name: 'outro',
	render: (deps) => (
		<PageShell theme="latte" width={null} footer={false}>
			<OutroPage data={deps.data} onExit={() => deps.navigate(lastStepName())} />
		</PageShell>
	),
};
