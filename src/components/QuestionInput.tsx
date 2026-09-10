import type { Question } from '../lib/survey/types';
import { Field, TextArea, TextInput } from './ui';

/**
 * 一道题的答题控件：按 `kind` 选题的形态。
 *
 * 这里只认题型，不认题目内容——题目是数据，加题型才需要动这个文件。
 * 答案一律是字符串：单选也存选中的那一项文字，简单、能直接进内容。
 */
export function QuestionInput({
	question,
	value,
	onChange,
}: {
	question: Question;
	value: string;
	onChange: (value: string) => void;
}) {
	if (question.kind === 'long') {
		return (
			<Field label={question.label}>
				<TextArea
					value={value}
					onInput={onChange}
					placeholder={question.placeholder}
					rows={question.rows ?? 5}
				/>
			</Field>
		);
	}

	if (question.kind === 'choice') {
		return (
			<Field label={question.label}>
				<div class="flex flex-wrap gap-2">
					{(question.options ?? []).map((option) => {
						const active = value === option;
						return (
							<button
								key={option}
								type="button"
								// 再点一下取消：留个「没答」的口子，不然选了就改不回去
								onClick={() => onChange(active ? '' : option)}
								class={`rounded-md border px-3 py-1.5 text-base transition ${
									active
										? 'border-ctp-mauve bg-ctp-mauve/10 text-ctp-text'
										: 'border-ctp-surface1 text-ctp-subtext0 hover:text-ctp-text'
								}`}
							>
								{option}
							</button>
						);
					})}
				</div>
			</Field>
		);
	}

	return (
		<Field label={question.label}>
			<TextInput value={value} onInput={onChange} placeholder={question.placeholder} />
		</Field>
	);
}
