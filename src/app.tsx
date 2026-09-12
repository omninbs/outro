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
import { STEPS, findStep, stepRoute, type StepContext } from './steps/_registry';

// 视图分派：地址里写着哪一页就渲染哪一页，向导走到哪一步同样只由地址决定
export function App() {
	const { data, patch, reset } = useCard();
	const { view, routeId, navigate } = useRouter();

	// 「认不出的 id」与「这份入口没问题」是两种处境，这里一次算清再分派
	const survey = view === 'survey' && routeId ? findSurvey(routeId) : undefined;
	const askable = !!survey && survey.questions.length > 0;
	// 走到哪一步同样只看地址；认不出退回第一步，免得下标落到表外
	const step = view === 'edit' ? Math.max(0, findStep(routeId ?? '')) : 0;

	// 回到向导只有一条原则：内容已经成型就停在最后一步——结尾页退回与问卷答完都是这样
	const toLastStep = () => navigate('edit', stepRoute(STEPS[STEPS.length - 1].id));
	// 重置是唯一会丢内容的动作，所以只有它需要一道确认；清空后回第一步
	const handleReset = () => {
		reset();
		navigate('edit', stepRoute(STEPS[0].id));
	};
	const finishSurvey = (from: Survey, answers: Answers) => {
		patch(buildFrom(from, answers));
		toLastStep();
	};

	if (view === 'home') {
		return (
			<PageShell width="standard">
				<HomePage />
			</PageShell>
		);
	}

	// 认不出的 id 不留空白页，而且只给一个标题块、不套卡片：没有内容，套一层框反而像「本该有东西」
	if (view === 'survey' && routeId && !survey) {
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
				<OutroPage data={data} onExit={toLastStep} />
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
				onSelect={(index) => navigate('edit', stepRoute(STEPS[index].id))}
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
					{step === 0 ? (
						<Button onClick={() => navigate('home')}>{COPY.action.backHome}</Button>
					) : (
						<Button onClick={() => navigate('edit', stepRoute(STEPS[step - 1].id))}>
							{COPY.action.prev}
						</Button>
					)}
					{step < STEPS.length - 1 && (
						<Button
							variant="primary"
							onClick={() => navigate('edit', stepRoute(STEPS[step + 1].id))}
						>
							{COPY.action.next}
						</Button>
					)}
				</ActionRow>
			</WizardShell>
		</PageShell>
	);
}
