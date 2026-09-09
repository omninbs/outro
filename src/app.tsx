import { useEffect, useState } from 'preact/hooks';
import { Checklist } from './components/Checklist';
import { ColophonPage } from './components/ColophonPage';
import { newField } from './components/FieldEditor';
import { Preview } from './components/Preview';
import { Stepper, type StepDef } from './components/Stepper';
import { Button } from './components/ui';
import { QUICK_FIELDS } from './lib/config';
import { evaluate } from './lib/evaluate';
import { useCard } from './lib/store';
import { ContentStep } from './steps/ContentStep';
import { GenerateStep } from './steps/GenerateStep';
import { NoticeStep } from './steps/NoticeStep';

const STEPS: StepDef[] = [
	{ id: 'content', label: '内容' },
	{ id: 'notice', label: '声明' },
	{ id: 'generate', label: '生成' },
];

/** 版权页是应用里的一个路由：#/colophon */
const PAGE_HASH = '#/colophon';

export function App() {
	const { data, patch, reset } = useCard();
	const [step, setStep] = useState(0);
	const [viewing, setViewing] = useState(() => window.location.hash === PAGE_HASH);
	const { hints, score, grade } = evaluate(data);

	useEffect(() => {
		const sync = () => setViewing(window.location.hash === PAGE_HASH);
		window.addEventListener('hashchange', sync);
		return () => window.removeEventListener('hashchange', sync);
	}, []);

	const addQuickField = (label: string) => {
		const quick = QUICK_FIELDS.find((q) => q.label === label);
		if (!quick || data.fields.some((f) => f.label.trim() === label)) return;
		patch({ fields: [...data.fields, newField(quick.label)] });
		setStep(0);
	};

	if (viewing) {
		return (
			<div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
				<ColophonPage data={data} exitHref="#/" />
			</div>
		);
	}

	return (
		<div class="mx-auto max-w-360 px-6 py-8">
			<header class="mb-6">
				<h1 class="text-lg font-semibold">版权页生成器</h1>
				<p class="mt-1 text-xs text-ctp-subtext0">
					按步骤填写内容，右侧实时预览，最后生成版权页
				</p>
			</header>

			<Stepper steps={STEPS} current={step} onSelect={setStep} />

			<div class="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
				<div>
					{step === 0 && <ContentStep data={data} patch={patch} />}
					{step === 1 && <NoticeStep data={data} patch={patch} />}
					{step === 2 && <GenerateStep onReset={reset} />}

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

				<div class="space-y-4 lg:sticky lg:top-8">
					<Preview data={data} />
					<Checklist hints={hints} score={score} grade={grade} onAdd={addQuickField} />
				</div>
			</div>
		</div>
	);
}
