import type { Question } from '../lib/survey/types';
import { Field, TextArea, TextInput } from './ui';

/**
 * 一道题的答题控件：按 `kind` 选题的形态。
 *
 * 这里只认题型，不认题目内容——题目是数据，加题型才需要动这个文件。
 * 答案一律是字符串：单选也存选中的那一项文字，简单、能直接进内容；
 * 所以单选除了选项还给一个自由输入框，选项之外的说法照样写得下。
 * 预填值（`question.default`）不在这里处理，它由问卷页初始化答案时给。
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
		const options = question.options ?? [];
		// 选中项之外的字都算「自己写的」：选项只是常用的那几个，不是全部可能
		const custom = options.includes(value) ? '' : value;

		return (
			<Field label={question.label}>
				<div class="space-y-2">
					<div class="flex flex-wrap gap-2">
						{options.map((option) => {
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

					{/* 选项之外还要有出路：填的是自由文本，答案一律是字符串，多一个出口不增加概念 */}
					<TextInput value={custom} onInput={onChange} placeholder="也可以自己写" />
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
