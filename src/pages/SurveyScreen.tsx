import { PageShell } from '../components/PageShell';
import { SurveyPage } from '../components/SurveyPage';
import { buildFrom } from '../lib/survey/build';
import type { Answers, Survey } from '../lib/survey/types';
import { lastStepName } from '../steps/_registry';
import type { PageDeps } from './_registry';

// 问卷页：一份问卷一页；答完把答案搬进内容，回向导最后一步
export function SurveyScreen({ survey, deps }: { survey: Survey; deps: PageDeps }) {
	const finish = (answers: Answers) => {
		deps.patch(buildFrom(survey, answers));
		deps.navigate(lastStepName());
	};

	return (
		<PageShell width="standard">
			<SurveyPage survey={survey} onFinish={finish} onExit={() => deps.navigate(null)} />
		</PageShell>
	);
}
