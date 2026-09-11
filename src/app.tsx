import { useEffect, useState } from 'preact/hooks';

import { OutroPage } from './components/OutroPage';
import { FilledList } from './components/FilledList';
import { HomePage } from './components/HomePage';
import { PageHeader } from './components/PageHeader';
import { PageShell } from './components/PageShell';
import { SurveyPage } from './components/SurveyPage';
import { WizardShell } from './components/WizardShell';
import { Button, ActionRow, RISE } from './components/ui';
import { COPY } from './lib/copy';
import { useRouter } from './lib/router';
import { useCard } from './lib/store';
import { buildFrom } from './lib/survey/build';
import { findSurvey } from './surveys/_registry';
import type { Answers, Survey } from './lib/survey/types';
import { STEPS, type StepContext } from './steps/_registry';

/** 首页、表单、问卷、最终页都在这里分派；步骤与问卷各自长什么样，归它们自己的表 */
export function App() {
	const { data, patch, reset } = useCard();
	const { view, surveyId, navigate } = useRouter();
	const [step, setStep] = useState(0);

	// 回到表单只有一条原则：内容已经成型就停在最后一步，没有「刚才那一步」才从第一步进
	const openForm = () => {
		setStep(0);
		navigate('form');
	};
	// 结尾页退回与问卷答完都是「内容刚成型」，停最后一步（它必须就是能进结尾页的那一步）
	const formAtLastStep = () => {
		setStep(STEPS.length - 1);
		navigate('form');
	};
	// 重置是唯一会丢内容的动作，所以只有它需要一道确认
	const handleReset = () => {
		reset();
		setStep(0);
	};

	// 地址里直接写入口 id（书签、别人给的链接）跟点那张卡是一回事
	useEffect(() => {
		if (view !== 'survey' || !surveyId) return;
		const survey = findSurvey(surveyId);
		if (survey && survey.questions.length === 0) openForm();
	}, [view, surveyId]);

	// 答完问卷就是「内容已经成型」，跟从结尾页退回来是同一种处境，所以两处走同一条路
	const finishSurvey = (survey: Survey, answers: Answers) => {
		patch(buildFrom(survey, answers));
		formAtLastStep();
	};

	if (view === 'home') {
		return (
			<PageShell width="standard">
				<HomePage />
			</PageShell>
		);
	}

	if (view === 'survey') {
		const survey = surveyId ? findSurvey(surveyId) : undefined;

		// 认不出的 id 不留空白页，而且只给一个标题块、不套卡片：没有内容，套一层框反而像「本该有东西」
		if (!survey) {
			return (
				<PageShell width="standard">
					<PageHeader
						title="没有这份问卷"
						description="地址里的问卷 id 认不出来，回首页重新选一份。"
					/>
				</PageShell>
			);
		}

		// 没有题的入口不该有问卷页：那一页上的「完成」点下去，等于把内容换成空的
		if (survey.questions.length > 0) {
			return (
				<PageShell width="standard">
					{/* 换一份问卷就是另一份答卷：换成它自己的 key，预填值才会按新题重算 */}
					<SurveyPage
						key={survey.id}
						survey={survey}
						onFinish={(answers) => finishSurvey(survey, answers)}
						onExit={() => navigate('home')}
					/>
				</PageShell>
			);
		}
	}

	if (view === 'outro') {
		return (
			<PageShell theme="latte" width={null} footer={false}>
				<OutroPage data={data} onExit={formAtLastStep} />
			</PageShell>
		);
	}

	const ctx: StepContext = {
		data,
		patch,
		onReset: handleReset,
		onPreview: () => navigate('outro'),
	};
	const current = STEPS[step];

	return (
		<PageShell>
			<WizardShell
				steps={STEPS}
				current={step}
				onSelect={setStep}
				sideList={<FilledList data={data} />}
			>
				{/* 换一步就是换一个节点，于是新内容淡进来，而不是原地把字全换掉 */}
				<div key={current.id} class={`flex flex-col gap-6 ${RISE}`}>
					{current.body(ctx)}
				</div>

				{current.listBelow && (
					<div class="wide:hidden">
						<FilledList data={data} />
					</div>
				)}

				<ActionRow>
					{step === 0 ? (
						<Button onClick={() => navigate('home')}>{COPY.action.backHome}</Button>
					) : (
						<Button onClick={() => setStep(step - 1)}>{COPY.action.prev}</Button>
					)}
					{step < STEPS.length - 1 && (
						<Button variant="primary" onClick={() => setStep(step + 1)}>
							{COPY.action.next}
						</Button>
					)}
				</ActionRow>
			</WizardShell>
		</PageShell>
	);
}
