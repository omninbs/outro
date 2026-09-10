import { useState } from 'preact/hooks';

import type { Answers, Survey } from '../lib/survey/types';
import { QuestionInput } from './QuestionInput';
import { Button, Panel } from './ui';

/**
 * 问卷页：把一份问卷（数据）渲染成题面，答案就地攒在组件状态里。
 *
 * 这里只管答题，不管答卷长什么样——答案交回调用方，由它搬成内容。
 * 所以页面上没有清单：问卷是「带引导的填写」，填完回表单继续，预览在那边看就够了。
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

	const answer = (questionId: string, value: string) =>
		setAnswers((prev) => ({ ...prev, [questionId]: value }));

	return (
		<div>
			<header class="mb-6">
				<h1 class="text-lg font-semibold">{survey.title}</h1>
				<p class="mt-1 text-base text-ctp-subtext0">{survey.description}</p>
			</header>

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

			<div class="mt-6 flex items-center justify-between">
				<Button onClick={onExit}>返回主页</Button>
				<Button variant="primary" onClick={() => onFinish(answers)}>
					完成
				</Button>
			</div>
		</div>
	);
}
