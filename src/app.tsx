import { OutroPage } from './components/OutroPage';
import { FilledList } from './components/FilledList';
import { HomePage } from './components/HomePage';
import { PageShell } from './components/PageShell';
import { SurveyPage } from './components/SurveyPage';
import { WizardShell } from './components/WizardShell';
import { Button, ActionRow, RISE } from './components/ui';
import { COPY } from './lib/copy';
import { useRouter } from './lib/router';
import { useCard } from './lib/store';
import { buildFrom } from './lib/survey/build';
import type { Answers } from './lib/survey/types';
import { STEPS, firstStepName, lastStepName, stepRoute, type StepContext } from './steps/_registry';
import { SURVEYS } from './surveys/_registry';

// 路由只在这里发生：hash 是哪个名字就渲染哪一页，认不出（含空）就是主页
export function App() {
	const { data, patch, reset } = useCard();
	const { name, navigate } = useRouter();

	const survey = SURVEYS.find((survey) => survey.id === name);
	// 三步是三个独立页面：各占一个地址，落到哪一步就渲染哪一步；没有问题的入口就是表单本身
	const step =
		STEPS.find((step) => stepRoute(step.id) === name) ??
		(survey && survey.questions.length === 0 ? STEPS[0] : undefined);

	if (step) {
		const index = STEPS.indexOf(step);
		const ctx: StepContext = {
			data,
			patch,
			onReset: () => {
				reset();
				navigate(firstStepName());
			},
			onPreview: () => navigate('outro'),
		};

		return (
			<PageShell>
				<WizardShell
					steps={STEPS}
					current={index}
					onSelect={(at) => navigate(stepRoute(STEPS[at].id))}
					sideList={<FilledList data={data} />}
				>
					<div key={step.id} class={`flex flex-col gap-6 ${RISE}`}>
						{step.body(ctx)}
					</div>

					{step.listBelow && (
						<div class="wide:hidden">
							<FilledList data={data} />
						</div>
					)}

					<ActionRow>
						{index === 0 ? (
							<Button onClick={() => navigate(null)}>{COPY.action.backHome}</Button>
						) : (
							<Button onClick={() => navigate(stepRoute(STEPS[index - 1].id))}>
								{COPY.action.prev}
							</Button>
						)}
						{index < STEPS.length - 1 && (
							<Button
								variant="primary"
								onClick={() => navigate(stepRoute(STEPS[index + 1].id))}
							>
								{COPY.action.next}
							</Button>
						)}
					</ActionRow>
				</WizardShell>
			</PageShell>
		);
	}

	// 换一份问卷就是另一份答卷：换 key 让它重建，预填值才按新的题目重算
	if (survey) {
		const finish = (answers: Answers) => {
			patch(buildFrom(survey, answers));
			navigate(lastStepName());
		};

		return (
			<PageShell width="standard">
				<SurveyPage
					key={survey.id}
					survey={survey}
					onFinish={finish}
					onExit={() => navigate(null)}
				/>
			</PageShell>
		);
	}

	if (name === 'outro') {
		return (
			<PageShell theme="latte" width={null} footer={false}>
				<OutroPage data={data} onExit={() => navigate(lastStepName())} />
			</PageShell>
		);
	}

	return (
		<PageShell width="standard">
			<HomePage />
		</PageShell>
	);
}
