import { useState } from 'preact/hooks';
import { Checklist } from './components/Checklist';
import { newField } from './components/FieldEditor';
import { Preview } from './components/Preview';
import { Stepper, type StepDef } from './components/Stepper';
import { Button } from './components/ui';
import { QUICK_FIELDS } from './lib/config';
import { evaluate } from './lib/evaluate';
import { useCard } from './lib/store';
import { ContentStep } from './steps/ContentStep';
import { ExportStep } from './steps/ExportStep';
import { LookStep } from './steps/LookStep';
import { NoticeStep } from './steps/NoticeStep';

const STEPS: StepDef[] = [
	{ id: 'content', label: '内容' },
	{ id: 'notice', label: '声明' },
	{ id: 'look', label: '外观' },
	{ id: 'export', label: '导出' },
];

export function App() {
	const { data, patch, reset } = useCard();
	const [step, setStep] = useState(0);
	const { hints, score, grade } = evaluate(data);

	const addQuickField = (label: string) => {
		const quick = QUICK_FIELDS.find((q) => q.label === label);
		if (!quick || data.fields.some((f) => f.label.trim() === label)) return;
		patch({ fields: [...data.fields, newField(quick.label)] });
		setStep(0);
	};

	return (
		<div class="mx-auto max-w-[1440px] px-6 py-8">
			<header class="mb-6">
				<h1 class="text-lg font-semibold">版权页卡片生成器</h1>
				<p class="mt-1 text-xs text-ctp-subtext0">
					按步骤填写内容，右侧实时预览，最后导出为 PNG
				</p>
			</header>

			<Stepper steps={STEPS} current={step} onSelect={setStep} />

			<div class="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
				<div>
					{step === 0 && <ContentStep data={data} patch={patch} />}
					{step === 1 && <NoticeStep data={data} patch={patch} />}
					{step === 2 && <LookStep data={data} patch={patch} />}
					{step === 3 && <ExportStep data={data} patch={patch} onReset={reset} />}

					<div class="mt-6 flex items-center justify-between">
						<Button disabled={step === 0} onClick={() => setStep(step - 1)}>
							上一步
						</Button>
						<Button
							variant="primary"
							disabled={step === STEPS.length - 1}
							onClick={() => setStep(step + 1)}
						>
							下一步
						</Button>
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
