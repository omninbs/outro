import { useState } from 'preact/hooks';

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

/**
 * 视图分派：地址里写着哪一页就渲染哪一页，四个分支各自把整页返回。
 * 没有「先渲染、再回头纠正地址」那一步——屏幕与地址于是永远在说同一件事。
 *
 * 步骤状态留在这一层、不放进向导：结尾页退回要落在**最后一步**，而那件事发生在这儿。
 */
export function App() {
	const { data, patch, reset } = useCard();
	const { view, surveyId, navigate } = useRouter();
	const [step, setStep] = useState(0);

	// 「地址里的 id 认不出来」与「这份入口没有问题」是两种处境：前者没有页可看，
	// 后者要的就是表单本身。所以这里一次算清，下面按它分派。
	const survey = view === 'survey' && surveyId ? findSurvey(surveyId) : undefined;
	const askable = !!survey && survey.questions.length > 0;

	// 回到表单只有一条原则：内容已经成型就停在最后一步——结尾页退回与问卷答完都是这样
	const formAtLastStep = () => {
		setStep(STEPS.length - 1);
		navigate('form');
	};
	// 重置是唯一会丢内容的动作，所以只有它需要一道确认
	const handleReset = () => {
		reset();
		setStep(0);
	};
	const finishSurvey = (from: Survey, answers: Answers) => {
		patch(buildFrom(from, answers));
		formAtLastStep();
	};

	if (view === 'home') {
		return (
			<PageShell width="standard">
				<HomePage />
			</PageShell>
		);
	}

	// 认不出的 id 不留空白页，而且只给一个标题块、不套卡片：没有内容，套一层框反而像「本该有东西」
	if (view === 'survey' && !survey) {
		return (
			<PageShell width="standard">
				<PageHeader
					title={COPY.page.missingSurvey.title}
					description={COPY.page.missingSurvey.description}
				/>
			</PageShell>
		);
	}

	// 换一份问卷就是另一份答卷：换 key 让它重建，预填值才按新的题目重算
	if (askable) {
		return (
			<PageShell width="standard">
				<SurveyPage
					key={survey.id}
					survey={survey}
					onFinish={(answers) => finishSurvey(survey, answers)}
					onExit={() => navigate('home')}
				/>
			</PageShell>
		);
	}

	if (view === 'outro') {
		return (
			<PageShell theme="latte" width={null} footer={false}>
				<OutroPage data={data} onExit={formAtLastStep} />
			</PageShell>
		);
	}

	// 剩下的就是表单：「不用预设」那条入口没有页可看，落的也是这里
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
