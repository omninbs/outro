import { OutroPage } from './pages/OutroPage';
import { FilledList } from './pages/FilledList';
import { HomePage } from './pages/HomePage';
import { PageShell } from './pages/PageShell';
import { SurveyPage } from './pages/SurveyPage';
import { WizardShell } from './pages/WizardShell';
import { Button, ActionRow, RISE } from './components/ui';
import { COPY } from './lib/copy';
import { use_router } from './lib/router';
import { use_card } from './lib/store';
import { build_from } from './lib/survey/build';
import type { Answers, Survey } from './lib/survey/types';
import {
	STEPS,
	first_step_name,
	last_step_name,
	step_route,
	type StepContext,
	type StepEntry,
} from './steps/_registry';
import { SURVEYS } from './surveys/_registry';

// 路由只在这里发生：hash 是哪个名字就渲染哪一页，认不出（含空）就是主页
export function App() {
	const { name } = use_router();

	// 逐类认地址：预览页、步骤、问卷依次认，都不命中才是主页
	const step = STEPS.find((step) => step_route(step.id) === name);
	const survey = SURVEYS.find((survey) => survey.id === name);

	return name === 'outro' ? (
		<OutroView />
	) : step ? (
		<WizardView step={step} />
	) : survey ? (
		<SurveyView survey={survey} />
	) : (
		<HomeView />
	);
}

// 向导页：一步一页
function WizardView({ step }: { step: StepEntry }) {
	const { navigate } = use_router();
	const { data, patch, reset } = use_card();
	const index = STEPS.indexOf(step);
	const ctx: StepContext = {
		data,
		patch,
		on_reset: () => {
			reset();
			navigate(first_step_name());
		},
		on_preview: () => navigate('outro'),
	};

	return (
		<PageShell>
			<WizardShell
				steps={STEPS}
				current={index}
				on_select={(at) => navigate(step_route(STEPS[at].id))}
				side_list={<FilledList data={data} />}
			>
				<div key={step.id} class={`flex flex-col gap-6 ${RISE}`}>
					{step.body(ctx)}
				</div>

				{step.list_below && (
					<div class="wide:hidden">
						<FilledList data={data} />
					</div>
				)}

				<WizardNav index={index} />
			</WizardShell>
		</PageShell>
	);
}

// 向导底部那排动作：第一步只回主页，中间加「上一步」，最后一步没有「下一步」
function WizardNav({ index }: { index: number }) {
	const { navigate } = use_router();
	return (
		<ActionRow>
			{index === 0 ? (
				<Button on_click={() => navigate(null)}>{COPY.action.back_home}</Button>
			) : (
				<Button on_click={() => navigate(step_route(STEPS[index - 1].id))}>
					{COPY.action.prev}
				</Button>
			)}
			{index < STEPS.length - 1 && (
				<Button variant="primary" on_click={() => navigate(step_route(STEPS[index + 1].id))}>
					{COPY.action.next}
				</Button>
			)}
		</ActionRow>
	);
}

// 问卷页：一份问卷一页；换一份就是另一份答卷，换 key 让它重建
function SurveyView({ survey }: { survey: Survey }) {
	const { navigate } = use_router();
	const { patch } = use_card();
	const finish = (answers: Answers) => {
		patch(build_from(survey, answers));
		navigate(last_step_name());
	};

	return (
		<PageShell width="standard">
			<SurveyPage
				key={survey.id}
				survey={survey}
				on_finish={finish}
				on_exit={() => navigate(null)}
			/>
		</PageShell>
	);
}

// 预览页：拿去截图的那一屏，点任意处退回向导最后一步
function OutroView() {
	const { navigate } = use_router();
	const { data } = use_card();
	return (
		<PageShell theme="latte" width={null} footer={false}>
			<OutroPage data={data} on_exit={() => navigate(last_step_name())} />
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
