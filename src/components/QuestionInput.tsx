import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';

import { COPY } from '../lib/copy';
import type { Question } from '../lib/survey/types';
import { Field, FADE, IconButton, HOVER, TextArea, TextInput } from './ui';

/** 预设的选中外观：横排的词与竖排的段落共用一套——选中长什么样，不随排法变 */
const tone = (active: boolean) =>
	active
		? 'border-ctp-mauve bg-ctp-mauve/10 text-ctp-text'
		: 'border-ctp-surface1 text-ctp-subtext0 press:text-ctp-text';

/** 词级预设横排：单选的取值都是词，一列扫过去就看完 */
const PILL = `rounded-md border px-3 py-1.5 text-base ${HOVER}`;

/**
 * 段落级预设整宽竖排。单选的排法照搬过来不行：一段现成的文字横排会挤成小方块，
 * 还得左右扫着读。它照的是多行框，所以换行也照原样排出来。
 */
const BLOCK = `w-full rounded-md border px-3 py-3 text-left text-base leading-relaxed whitespace-pre-wrap ${HOVER}`;

/** 「自定义」不是一条预设，是另一种输入形态，长相上要跟预设分得开 */
const CUSTOM =
	'rounded-md border border-dashed border-ctp-surface1 text-base text-ctp-subtext0 ' +
	`${HOVER} press:border-ctp-mauve press:text-ctp-mauve`;

/**
 * 一道题的答题控件：只认题型，不认题目内容——题目是数据，加题型才需要动这个文件。
 *
 * 带预设的题都是两个形态，靠「自定义」来回切。**两态互斥是刻意的**：预设和自由输入
 * 一起摆在眼前，人会以为要两边都填。点一条预设是**整段换成它**（再点一下取消，留个
 * 「没答」的口子），进自定义时拿当前答案当底子，× 退回预设等于撤销、不是清空。
 * 预设怎么排看它有多长：词横排，段落竖排成整宽的一块块。
 * 预设之外只剩一个意思——自己写；空框里那句提示说的就是这件事，与题目数据无关。
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
	const long = question.kind === 'long';
	const [custom, setCustom] = useState(() => value !== '' && !options.includes(value));
	// 叉掉时放回的那一项：× 是撤销，不是清空
	const [revertTo, setRevertTo] = useState('');

	/** 当前题的框：形态跟着答案的形状走，同一件事的两种长度 */
	const answerBox = (placeholder: string, action?: ComponentChildren) =>
		long ? (
			<TextArea value={value} onInput={onChange} placeholder={placeholder} action={action} />
		) : (
			<TextInput value={value} onInput={onChange} placeholder={placeholder} action={action} />
		);

	if (options.length === 0) {
		return <Field label={question.label}>{answerBox(COPY.placeholder)}</Field>;
	}

	return (
		/* 一排预设是「一组选项」，不是一个控件（见 `Field` 的 `group`）——标签只该包一个控件 */
		<Field label={question.label} group={!custom}>
			{custom ? (
				answerBox(
					'自己写',
					<IconButton
						title="退回选项"
						onClick={() => {
							onChange(revertTo);
							setCustom(false);
						}}
					/>,
				)
			) : (
				/* 窄屏贴边的卡片不提供横向留白，这一栏自己带一次，才跟题面落在同一竖线 */
				<div class={`flex gap-2 max-narrow:px-inset ${FADE} ${long ? 'flex-col' : 'flex-wrap'}`}>
					{options.map((option) => {
						const active = value === option;
						return (
							<button
								key={option}
								type="button"
								onClick={() => onChange(active ? '' : option)}
								class={`${long ? BLOCK : PILL} ${tone(active)}`}
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
						class={`${CUSTOM} ${long ? 'w-full px-3 py-2' : 'px-3 py-1.5'}`}
					>
						自定义
					</button>
				</div>
			)}
		</Field>
	);
}
