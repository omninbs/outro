import { useState } from 'preact/hooks';
import { ColophonPage } from './components/ColophonPage';
import { FilledList } from './components/FilledList';
import { Stepper, type StepDef } from './components/Stepper';
import { Button } from './components/ui';
import { useRouter } from './lib/router';
import { useCard } from './lib/store';
import { DescribeStep } from './steps/DescribeStep';
import { GenerateStep } from './steps/GenerateStep';
import { SummaryStep } from './steps/SummaryStep';

const STEPS: StepDef[] = [
	{ id: 'summary', label: '摘要' },
	{ id: 'describe', label: '描述' },
	{ id: 'generate', label: '生成' },
];

/** 视图由状态切换，见 lib/router.tsx */
export function App() {
	const { data, patch, reset } = useCard();
	const { view, navigate } = useRouter();
	const [step, setStep] = useState(0);

	if (view === 'colophon') {
		return (
			<div class="safe-area flex min-h-dvh flex-col">
				<ColophonPage data={data} onExit={() => navigate('wizard')} />
			</div>
		);
	}

	return (
		<div class="safe-area min-h-dvh bg-ctp-base text-ctp-text antialiased">
			<div class="mx-auto max-w-360 px-6 py-8">
				<header class="mb-6">
					<h1 class="text-lg font-semibold">版权页生成器</h1>
					<p class="mt-1 text-base text-ctp-subtext0">
						按步骤填写内容，右侧实时确认已填信息，最后生成版权页
					</p>
				</header>

				<Stepper steps={STEPS} current={step} onSelect={setStep} />

				<div class="mt-6 grid items-start gap-6 lg:landscape:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
					<div>
						<div class="space-y-6">
							{step === 0 && <SummaryStep data={data} patch={patch} />}
							{step === 1 && <DescribeStep data={data} patch={patch} />}
							{step === 2 && (
								<GenerateStep onReset={reset} onGenerate={() => navigate('colophon')} />
							)}
						</div>

						{step === 2 && (
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
					</div>

					<div class="hidden lg:landscape:sticky lg:landscape:top-8 lg:landscape:block">
						<FilledList data={data} />
					</div>
				</div>
			</div>
		</div>
	);
}
