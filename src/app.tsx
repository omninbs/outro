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
import type { Answers, Survey } from './lib/survey/types';
import { STEPS, type StepContext } from './steps/_registry';

// 页面分派：地址里认得出哪个页面就渲染它；认不出就是主页，所以主页是兜底、不是一个分支
export function App() {
	const { data, patch, reset } = useCard();
	const { page, navigate } = useRouter();

	// 回到向导只有一条原则：内容已经成型就停在最后一步——结尾页退回与问卷答完都是这样
	const toLastStep = () => navigate({ kind: 'step', step: STEPS[STEPS.length - 1] });
	// 重置是唯一会丢内容的动作，所以只有它需要一道确认；清空后回第一步
	const handleReset = () => {
		reset();
		navigate({ kind: 'step', step: STEPS[0] });
	};
	const finishSurvey = (from: Survey, answers: Answers) => {
		patch(buildFrom(from, answers));
		toLastStep();
	};

	// 地址没写出一个页面，就是主页——它是落点，不占一个分支
	if (!page) {
		return (
			<PageShell width="standard">
				<HomePage />
			</PageShell>
		);
	}

	// 换一份问卷就是另一份答卷：换 key 让它重建，预填值才按新的题目重算
	if (page.kind === 'survey' && page.survey.questions.length > 0) {
		return (
			<PageShell width="standard">
				<SurveyPage
					key={page.survey.id}
					survey={page.survey}
					onFinish={(answers) => finishSurvey(page.survey, answers)}
					onExit={() => navigate(null)}
				/>
			</PageShell>
		);
	}

	if (page.kind === 'outro') {
		return (
			<PageShell theme="latte" width={null} footer={false}>
				<OutroPage data={data} onExit={toLastStep} />
			</PageShell>
		);
	}

	// 剩下的就是表单：一个步骤页；没有问题的那份入口落的也是第一步
	const index = page.kind === 'step' ? STEPS.indexOf(page.step) : 0;
	const current = STEPS[index];
	const ctx: StepContext = {
		data,
		patch,
		onReset: handleReset,
		onPreview: () => navigate({ kind: 'outro' }),
	};

	return (
		<PageShell>
			<WizardShell
				steps={STEPS}
				current={index}
				onSelect={(at) => navigate({ kind: 'step', step: STEPS[at] })}
				sideList={<FilledList data={data} />}
			>
				<div key={current.id} class={`flex flex-col gap-6 ${RISE}`}>
					{current.body(ctx)}
				</div>

				{current.listBelow && (
					<div class="wide:hidden">
						<FilledList data={data} />
					</div>
				)}

				<ActionRow>
					{index === 0 ? (
						<Button onClick={() => navigate(null)}>{COPY.action.backHome}</Button>
					) : (
						<Button onClick={() => navigate({ kind: 'step', step: STEPS[index - 1] })}>
							{COPY.action.prev}
						</Button>
					)}
					{index < STEPS.length - 1 && (
						<Button
							variant="primary"
							onClick={() => navigate({ kind: 'step', step: STEPS[index + 1] })}
						>
							{COPY.action.next}
						</Button>
					)}
				</ActionRow>
			</WizardShell>
		</PageShell>
	);
}
