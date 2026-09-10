import { useState } from 'preact/hooks';

import type { Question } from '../lib/survey/types';
import { Field, IconButton, TextArea, TextInput } from './ui';

/** 选项按钮的外观：选中是主题色描边 + 淡底，未选中是普通描边 */
const optionClass = (active: boolean) =>
	`rounded-md border px-3 py-1.5 text-base transition ${
		active
			? 'border-ctp-mauve bg-ctp-mauve/10 text-ctp-text'
			: 'border-ctp-surface1 text-ctp-subtext0 hover:text-ctp-text'
	}`;

/** 「自定义」按钮：虚线描边，跟实心的选项区分开——它不是选项，是另一种输入形态 */
const CUSTOM_BUTTON =
	'rounded-md border border-dashed border-ctp-surface1 px-3 py-1.5 text-base text-ctp-subtext0 ' +
	'transition hover:border-ctp-mauve hover:text-ctp-mauve';

/**
 * 一道题的答题控件：按 `kind` 选题的形态。
 *
 * 这里只认题型，不认题目内容——题目是数据，加题型才需要动这个文件。
 * 答案一律是字符串：单选也存那一项的文字，简单、能直接进内容。
 *
 * 单选有两个形态，靠「自定义」切换：默认是一排选项，点「自定义」整排换成输入框，
 * 叉掉输入框就退回选项。两态互斥是刻意的——选项和自由输入同时摆在眼前，
 * 会让人以为要两边都填。
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
	const options = question.options ?? [];
	// 一进来就带着「选项之外」的答案（比如改过之后重新挂载）时，直接停在自定义形态
	const [custom, setCustom] = useState(() => value !== '' && !options.includes(value));
	// 进自定义之前选中的那一项：叉掉时放回去，这样「叉掉」等于撤销，不是清空
	const [revertTo, setRevertTo] = useState('');

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
				{custom ? (
					<div class="flex items-center gap-2">
						<TextInput value={value} onInput={onChange} placeholder="自己写" />
						<IconButton
							title="退回选项"
							onClick={() => {
								onChange(revertTo);
								setCustom(false);
							}}
						>
							×
						</IconButton>
					</div>
				) : (
					<div class="flex flex-wrap gap-2">
						{options.map((option) => {
							const active = value === option;
							return (
								<button
									key={option}
									type="button"
									// 再点一下取消：留个「没答」的口子，不然选了就改不回去
									onClick={() => onChange(active ? '' : option)}
									class={optionClass(active)}
								>
									{option}
								</button>
							);
						})}
						<button
							type="button"
							onClick={() => {
								setRevertTo(value);
								setCustom(true);
							}}
							class={CUSTOM_BUTTON}
						>
							自定义
						</button>
					</div>
				)}
			</Field>
		);
	}

	return (
		<Field label={question.label}>
			<TextInput value={value} onInput={onChange} placeholder={question.placeholder} />
		</Field>
	);
}
