import { OutroPage } from './components/OutroPage';
import { FilledList } from './components/FilledList';
import { HomePage } from './components/HomePage';
import { PageShell } from './components/PageShell';
import { SurveyPage } from './components/SurveyPage';
import { WizardShell } from './components/WizardShell';
import { Button, ActionRow, RISE } from './components/ui';
import { COPY } from './lib/copy';
import { useRouter, type Navigate } from './lib/router';
import { useCard } from './lib/store';
import { buildFrom } from './lib/survey/build';
import type { Answers, Survey } from './lib/survey/types';
import type { CardData, Patch } from './lib/types';
import {
	STEPS,
	firstStepName,
	lastStepName,
	stepRoute,
	type StepContext,
	type StepEntry,
} from './steps/_registry';
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

	if (step) return <WizardView step={step} data={data} patch={patch} reset={reset} navigate={navigate} />;
	if (survey) return <SurveyView survey={survey} patch={patch} navigate={navigate} />;
	if (name === 'outro') return <OutroView data={data} navigate={navigate} />;
	return <HomeView />;
}

// 向导页：一步一页
function WizardView({
	step,
	data,
	patch,
	reset,
	navigate,
}: {
	step: StepEntry;
	data: CardData;
	patch: Patch;
	reset: () => void;
	navigate: Navigate;
}) {
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

				<WizardNav index={index} navigate={navigate} />
			</WizardShell>
		</PageShell>
	);
}

// 向导底部那排动作：第一步只回主页，中间加「上一步」，最后一步没有「下一步」
function WizardNav({ index, navigate }: { index: number; navigate: Navigate }) {
	return (
		<ActionRow>
			{index === 0 ? (
				<Button onClick={() => navigate(null)}>{COPY.action.backHome}</Button>
			) : (
				<Button onClick={() => navigate(stepRoute(STEPS[index - 1].id))}>
					{COPY.action.prev}
				</Button>
			)}
			{index < STEPS.length - 1 && (
				<Button variant="primary" onClick={() => navigate(stepRoute(STEPS[index + 1].id))}>
					{COPY.action.next}
				</Button>
			)}
		</ActionRow>
	);
}

// 问卷页：一份问卷一页；换一份就是另一份答卷，换 key 让它重建
function SurveyView({
	survey,
	patch,
	navigate,
}: {
	survey: Survey;
	patch: Patch;
	navigate: Navigate;
}) {
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

// 预览页：拿去截图的那一屏，点任意处退回向导最后一步
function OutroView({ data, navigate }: { data: CardData; navigate: Navigate }) {
	return (
		<PageShell theme="latte" width={null} footer={false}>
			<OutroPage data={data} onExit={() => navigate(lastStepName())} />
		</PageShell>
	);
}

// 主页：认不出名字的落点
function HomeView() {
	return (
		<PageShell width="standard">
			<HomePage />
		</PageShell>
	);
}
