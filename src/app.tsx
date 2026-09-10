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

/** 四个页面：首页、表单、问卷、最终页。步骤表在 steps/_registry，问卷表在 surveys/_registry，这里只管分派 */
export function App() {
	const { data, patch, reset } = useCard();
	const { view, surveyId, navigate } = useRouter();
	const [step, setStep] = useState(0);

	// 首页点「编辑表单」：从第一步开始——刚进来的人没有「刚才那一步」，从头顺读才对
	const openForm = () => {
		setStep(0);
		navigate('form');
	};
	// 从结尾页退回：停在**最后一步**。「生成」就在第三步，所以这是「回到刚才那一步」——
	// 前面两步的内容刚刚都在结尾页上看过一遍了，再从头走一遍只是让人多点两下
	// （步骤表将来变了要看这里：最后一步必须是能进结尾页的那一步）
	const backToForm = () => {
		setStep(STEPS.length - 1);
		navigate('form');
	};
	// 重置是唯一会丢内容的动作，所以它有三步确认（第三步的 ConfirmButton）
	const handleReset = () => {
		reset();
		setStep(0);
	};

	// 从首页选一个入口：有题的进问卷页，没有题的（「编辑表单」）没有页可看，直接进表单。
	// 问卷一个字都不动已有内容：进问卷页只是看看、中途退出来，
	// 不该把已经填好的东西弄丢，它们答完的那一刻整份替换内容
	const startSurvey = (survey: Survey) => {
		if (survey.questions.length === 0) openForm();
		else navigate('survey', survey.id);
	};

	// 地址里直接写 #edit（书签、别人给的链接）跟点那张卡是一回事。
	// 放 effect 里是因为渲染期间不能改状态；地址换掉之后 view 就不是 survey 了，不会重复触发
	useEffect(() => {
		if (view !== 'survey' || !surveyId) return;
		const survey = findSurvey(surveyId);
		if (survey && survey.questions.length === 0) openForm();
	}, [view, surveyId]);

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

		// 没有题的入口没有问卷页：落到下面的表单去（地址由上面的 effect 收拾）。
		// 空问卷页上那个「完成」点下去等于把内容换成空的
		if (survey.questions.length > 0) {
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
	}

	if (view === 'outro') {
		return (
			<PageShell theme="latte" width={null} footer={false}>
				<OutroPage data={data} onExit={backToForm} />
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
				{/* key 用步骤 id：换一步就是换一个节点，于是那一步的内容是淡进来的（RISE），
				    而不是原地把字全换掉 */}
				<div key={current.id} class={`flex flex-col gap-6 ${RISE}`}>
					{current.body(ctx)}
				</div>

				{current.listBelow && (
					<div class="mt-6 wide:hidden">
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
