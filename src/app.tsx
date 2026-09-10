import { useState } from 'preact/hooks';

import { OutroPage } from './components/OutroPage';
import { FilledList } from './components/FilledList';
import { HomePage } from './components/HomePage';
import { PageShell } from './components/PageShell';
import { WizardShell } from './components/WizardShell';
import { Button } from './components/ui';
import { useRouter } from './lib/router';
import { useCard } from './lib/store';
import { STEPS, type StepContext } from './steps/registry';

/** 三个页面：首页、表单、最终页。哪一步显示什么由 steps/registry 决定，这里只管分派 */
export function App() {
	const { data, patch, reset } = useCard();
	const { view, navigate } = useRouter();
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

	if (view === 'home') {
		return (
			<PageShell>
				<HomePage />
			</PageShell>
		);
	}

	if (view === 'outro') {
		return (
			<PageShell theme="latte">
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
					<div class="mt-6 lg:landscape:hidden">
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
