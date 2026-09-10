import { useState } from 'preact/hooks';

import { OutroPage } from './components/OutroPage';
import { FilledList } from './components/FilledList';
import { HomePage } from './components/HomePage';
import { PageShell } from './components/PageShell';
import { SurveyPage } from './components/SurveyPage';
import { WizardShell } from './components/WizardShell';
import { Button, Panel } from './components/ui';
import { useRouter } from './lib/router';
import { useCard } from './lib/store';
import { buildFrom } from './lib/survey/build';
import { findSurvey } from './lib/survey/registry';
import type { Answers, Survey } from './lib/survey/types';
import { STEPS, type StepContext } from './steps/registry';

/** 四个页面：首页、表单、问卷、最终页。步骤表在 steps/registry，问卷表在 lib/survey/registry，这里只管分派 */
export function App() {
	const { data, patch, reset } = useCard();
	const { view, surveyId, navigate } = useRouter();
	const [step, setStep] = useState(0);

	// 回到表单、以及重置数据，都从第一步重新开始：这两件事之后停在中间某一步没有道理
	const backToStart = () => {
		setStep(0);
		navigate('form');
	};
	const handleReset = () => {
		reset();
		setStep(0);
	};

	// 从首页选一份问卷。空预设就是 questions 为空的问卷：没有题可答，直接进表单从零填
	const startSurvey = (survey: Survey) => {
		reset();
		if (survey.questions.length === 0) {
			setStep(0);
			navigate('form');
			return;
		}
		navigate('survey', survey.id);
	};

	// 答完问卷：答案搬成内容，整份替换当前内容，然后落到表单的最后一步（生成）。
	// 问卷和表单是同一件事的两条路——问卷只是把前两步替你问完了，收尾仍在表单里
	const finishSurvey = (survey: Survey, answers: Answers) => {
		patch(buildFrom(survey, answers));
		setStep(STEPS.length - 1);
		navigate('form');
	};

	if (view === 'home') {
		return (
			<PageShell width="medium">
				<HomePage onPick={startSurvey} />
			</PageShell>
		);
	}

	if (view === 'survey') {
		const survey = surveyId ? findSurvey(surveyId) : undefined;

		// 认不出的 id（手写的地址、改名后的旧链接）不留空白页，给一句话和页脚那个出口
		if (!survey) {
			return (
				<PageShell width="medium">
					<Panel title="没有这份问卷">
						<p class="text-base leading-relaxed text-ctp-subtext0">
							地址里的问卷 id 认不出来，回首页重新选一份。
						</p>
					</Panel>
				</PageShell>
			);
		}

		return (
			<PageShell width="medium">
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

				<div class="mt-6 flex items-center justify-between">
					{step === 0 ? (
						// 第一步没有「上一步」可退，这个位置改成退出表单
						<Button onClick={() => navigate('home')}>返回首页</Button>
					) : (
						<Button onClick={() => setStep(step - 1)}>上一步</Button>
					)}
					{step < STEPS.length - 1 && (
						<Button variant="primary" onClick={() => setStep(step + 1)}>
							下一步
						</Button>
					)}
				</div>
			</WizardShell>
		</PageShell>
	);
}
