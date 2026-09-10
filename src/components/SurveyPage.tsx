import { useState } from 'preact/hooks';

import { buildFrom } from '../lib/survey/build';
import type { Answers, Survey } from '../lib/survey/types';
import { FilledList } from './FilledList';
import { QuestionInput } from './QuestionInput';
import { Button, Panel } from './ui';

/**
 * 问卷页：把一份问卷（数据）渲染成题面，答案就地攒在组件状态里。
 *
 * 右侧清单是「按当前答案算出来的结尾页」的实时预览——它和结尾页走同一个
 * resolveOutro，所以预览和最终页不会长歪。答案只活在这一页，答完由调用方决定去哪。
 */
export function SurveyPage({
	survey,
	onFinish,
	onExit,
}: {
	survey: Survey;
	onFinish: (answers: Answers) => void;
	onExit: () => void;
}) {
	const [answers, setAnswers] = useState<Answers>({});

	const preview = buildFrom(survey, answers);
	const answer = (questionId: string, value: string) =>
		setAnswers((prev) => ({ ...prev, [questionId]: value }));

	return (
		<div>
			<header class="mb-6">
				<h1 class="text-lg font-semibold">{survey.title}</h1>
				<p class="mt-1 text-base text-ctp-subtext0">{survey.description}</p>
			</header>

			<div class="grid items-start gap-6 landscape:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
				<Panel>
					{survey.questions.map((question) => (
						<QuestionInput
							key={question.id}
							question={question}
							value={answers[question.id] ?? ''}
							onChange={(value) => answer(question.id, value)}
						/>
					))}
				</Panel>

				{/* top-12 跟 PageShell 的 py-12 对齐，滚动时预览顶部与容器顶部同高 */}
				<div class="hidden landscape:sticky landscape:top-12 landscape:block">
					<FilledList data={preview} />
				</div>
			</div>

			<div class="mt-6 landscape:hidden">
				<FilledList data={preview} />
			</div>

			<div class="mt-6 flex items-center justify-between">
				<Button onClick={onExit}>返回主页</Button>
				<Button variant="primary" onClick={() => onFinish(answers)}>
					生成结尾页
				</Button>
			</div>
		</div>
	);
}
