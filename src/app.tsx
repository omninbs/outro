import { useState } from 'preact/hooks';

import { OutroPage } from './components/OutroPage';
import { FilledList } from './components/FilledList';
import { HomePage } from './components/HomePage';
import { PageHeader } from './components/PageHeader';
import { PageShell } from './components/PageShell';
import { SurveyPage } from './components/SurveyPage';
import { WizardShell } from './components/WizardShell';
import { Button, ActionRow } from './components/ui';
import { COPY } from './lib/copy';
import { useRouter } from './lib/router';
import { useCard } from './lib/store';
import { buildFrom } from './lib/survey/build';
import { findSurvey } from './surveys/_registry';
import type { Answers, Survey } from './lib/survey/types';
import { STEPS, type StepContext } from './steps/_registry';

/** 四个页面：首页、表单、问卷、最终页。步骤表在 steps/_registry，问卷表在 surveys/_registry，这里只管分派 */
export function App() {
	const { data, patch, reset } = useCard();
	const { view, surveyId, navigate } = useRouter();
	const [step, setStep] = useState(0);

	// 回到表单从第一步开始：从结尾页退回来时停在中间某一步没有道理
	const backToStart = () => {
		setStep(0);
		navigate('form');
	};
	// 重置是唯一会丢内容的动作，所以它有三步确认（第三步的 ConfirmButton）
	const handleReset = () => {
		reset();
		setStep(0);
	};

	// 从首页选一份问卷：有题的进问卷页，空预设（questions 为空）没有题可答，直接进表单。
	//
	// 这里**一个字都不动内容**。碰内容的地方只有两个：答完问卷（整份替换）、
	// 以及在第三步点「重置」（有二次确认）。从前是「点开卡片就先清空」，
	// 于是从表单退回首页、再点任何一张卡回来，辛苦填的东西就没了——
	// 内容会丢这种事，只能发生在用户明确按下去的那一刻
	const startSurvey = (survey: Survey) => {
		if (survey.questions.length === 0) {
			setStep(0);
			navigate('form');
			return;
		}
		navigate('survey', survey.id);
	};

	// 答完问卷：答案搬成内容，整份替换当前内容，然后回到表单的第一步（摘要）。
	// 回第一步而不是推到最后一步，是留给用户按需要再编辑的余地——问卷只把常见的问题问完，
	// 答案落进内容之后，标题、元数据这些还得让人过一眼、改一改；直接推到「生成」等于把这段路跳过去
	const finishSurvey = (survey: Survey, answers: Answers) => {
		patch(buildFrom(survey, answers));
		setStep(0);
		navigate('form');
	};

	if (view === 'home') {
		return (
			<PageShell width="standard">
				<HomePage onPick={startSurvey} />
			</PageShell>
		);
	}

	if (view === 'survey') {
		const survey = surveyId ? findSurvey(surveyId) : undefined;

		// 认不出的 id（手写的地址、改名后的旧链接）不留空白页。
		// 用页面自己的标题块，不套卡片：404 没有内容，套一层框反而像「这里本该有东西」
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

		return (
			<PageShell width="standard">
				<SurveyPage
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
				<OutroPage data={data} onExit={backToStart} />
			</PageShell>
		);
	}

	const ctx: StepContext = {
		data,
		patch,
		onReset: handleReset,
		onGenerate: () => navigate('outro'),
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
				<div class="space-y-6">{current.body(ctx)}</div>

				{current.listBelow && (
					<div class="mt-6 landscape:hidden">
						<FilledList data={data} />
					</div>
				)}

				<ActionRow>
					{step === 0 ? (
						// 第一步没有「上一步」可退，这个位置改成退出表单
						<Button onClick={() => navigate('home')}>{COPY.action.backHome}</Button>
					) : (
						<Button onClick={() => setStep(step - 1)}>上一步</Button>
					)}
					{step < STEPS.length - 1 && (
						<Button variant="primary" onClick={() => setStep(step + 1)}>
							下一步
						</Button>
					)}
				</ActionRow>
			</WizardShell>
		</PageShell>
	);
}
