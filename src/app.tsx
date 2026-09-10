import { useState } from 'preact/hooks';

import { ColophonPage } from './components/ColophonPage';
import { FilledList } from './components/FilledList';
import { PageShell } from './components/PageShell';
import { WizardShell } from './components/WizardShell';
import { Button } from './components/ui';
import { useRouter } from './lib/router';
import { useCard } from './lib/store';
import { STEPS, type StepContext } from './steps/registry';

/** 只有两个页面：向导和最终页。哪一步显示什么由 steps/registry 决定，这里只管分派 */
export function App() {
	const { data, patch, reset } = useCard();
	const { view, navigate } = useRouter();
	const [step, setStep] = useState(0);

	if (view === 'colophon') {
		return (
			<PageShell theme="latte">
				<ColophonPage data={data} onExit={() => navigate('wizard')} />
			</PageShell>
		);
	}

	const ctx: StepContext = { data, patch, onReset: reset, onGenerate: () => navigate('colophon') };
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
					<div class="mt-6 lg:landscape:hidden">
						<FilledList data={data} />
					</div>
				)}

				<div class="mt-6 flex items-center justify-between">
					<Button disabled={step === 0} onClick={() => setStep(step - 1)}>
						上一步
					</Button>
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
