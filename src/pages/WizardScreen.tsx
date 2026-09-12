import { FilledList } from '../components/FilledList';
import { PageShell } from '../components/PageShell';
import { WizardShell } from '../components/WizardShell';
import { Button, ActionRow, RISE } from '../components/ui';
import { COPY } from '../lib/copy';
import {
	STEPS,
	firstStepName,
	stepRoute,
	type StepContext,
	type StepEntry,
} from '../steps/_registry';
import type { PageDeps } from './_registry';
import { OUTRO_PAGE } from './outro';

// 步骤页：一步一页；外壳与步骤条是三步共用的排版，页面身份仍在这一步自己身上
export function WizardScreen({ step, deps }: { step: StepEntry; deps: PageDeps }) {
	const index = STEPS.indexOf(step);
	const ctx: StepContext = {
		data: deps.data,
		patch: deps.patch,
		// 重置是唯一会丢内容的动作，确认在第三步那颗按钮上；清空后回第一步
		onReset: () => {
			deps.reset();
			deps.navigate(firstStepName());
		},
		onPreview: () => deps.navigate(OUTRO_PAGE.name),
	};

	return (
		<PageShell>
			<WizardShell
				steps={STEPS}
				current={index}
				onSelect={(at) => deps.navigate(stepRoute(STEPS[at].id))}
				sideList={<FilledList data={deps.data} />}
			>
				<div key={step.id} class={`flex flex-col gap-6 ${RISE}`}>
					{step.body(ctx)}
				</div>

				{step.listBelow && (
					<div class="wide:hidden">
						<FilledList data={deps.data} />
					</div>
				)}

				<ActionRow>
					{index === 0 ? (
						<Button onClick={() => deps.navigate(null)}>{COPY.action.backHome}</Button>
					) : (
						<Button onClick={() => deps.navigate(stepRoute(STEPS[index - 1].id))}>
							{COPY.action.prev}
						</Button>
					)}
					{index < STEPS.length - 1 && (
						<Button
							variant="primary"
							onClick={() => deps.navigate(stepRoute(STEPS[index + 1].id))}
						>
							{COPY.action.next}
						</Button>
					)}
				</ActionRow>
			</WizardShell>
		</PageShell>
	);
}
