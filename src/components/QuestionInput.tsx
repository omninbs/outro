import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';

import { COPY } from '../lib/copy';
import type { Question } from '../lib/survey/types';
import { Field, FADE, IconButton, HOVER, TextArea, TextInput } from './ui';

/** 预设的选中外观：横排的小按钮与竖排的整宽块共用这一套颜色，两处只有排法不同 */
const tone = (active: boolean) =>
	active
		? 'border-ctp-mauve bg-ctp-mauve/10 text-ctp-text'
		: 'border-ctp-surface1 text-ctp-subtext0 hover:text-ctp-text';

/** 词级预设：横着排的小按钮——单选的取值都是词，横排一列能一眼扫完 */
const PILL = `rounded-md border px-3 py-1.5 text-base ${HOVER}`;

/**
 * 段落级预设：竖着排的整宽块。
 *
 * 单选的排法照搬过来不行：一段现成的文字横排会挤成小方块，读起来还得左右扫。
 * 所以整宽、左对齐、上下留得比小按钮多一点。`whitespace-pre-wrap` 让预设里的换行照原样显示
 * ——它照的是多行框，不能把换行吞掉。
 */
const BLOCK = `w-full rounded-md border px-3 py-3 text-left text-base leading-relaxed whitespace-pre-wrap ${HOVER}`;

/** 「自定义」：虚线描边，跟实心的预设区分开——它不是预设，是另一种输入形态 */
const CUSTOM =
	'rounded-md border border-dashed border-ctp-surface1 text-base text-ctp-subtext0 ' +
	`${HOVER} hover:border-ctp-mauve hover:text-ctp-mauve`;

/**
 * 一道题的答题控件：按 `kind` 选题的形态。
 *
 * 这里只认题型，不认题目内容——题目是数据，加题型才需要动这个文件。
 * 答案一律是字符串：单选存那一项的文字，段落题的预设也存那一段文字，简单、能直接进内容。
 *
 * 带 `options` 的题都有两个形态，靠「自定义」切换：默认是预设，点「自定义」换成输入框，
 * 叉掉输入框就退回预设。两态互斥是刻意的——预设和自由输入同时摆在眼前，
 * 会让人以为要两边都填。预设怎么排看它有多长：词（单选）横排成小按钮，
 * 段落（多行题）竖排成整宽的一块块。
 * 点一条预设就是**整段换成它**（再点一下取消，留个「没答」的口子）；
 * 进自定义时框里带着当前答案，预设那段字当底子，改起来不用重打。
 *
 * 那个输入框不是另做一个带 × 的框，就是 `TextInput` / `TextArea` 多给了一个 `action`：
 * × 看起来在框里，框的内边距、高度跟问卷里别的输入框天生一样。
 * 预填值（`question.default`）不在这里处理，它由问卷页初始化答案时给。
 * 空框里的灰字也不来自题目数据：进了自定义形态就是「自己写」，没预设的题一律给
 * `COPY.placeholder`（「不显示」）——不管哪道题，空答案的去处都是「不印出来」。
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
	// 段落题的答案是「一段话」，所以框是多行框；其余是单行框
	const long = question.kind === 'long';
	// 一进来就带着「预设之外」的答案（比如改过之后重新挂载）时，直接停在自定义形态
	const [custom, setCustom] = useState(() => value !== '' && !options.includes(value));
	// 进自定义之前选中的那一项：叉掉时放回去，这样「叉掉」等于撤销，不是清空
	const [revertTo, setRevertTo] = useState('');

	/** 当前题的框：形态由 `kind` 定，两个形态是同一件事的两种长度 */
	const answerBox = (placeholder: string, action?: ComponentChildren) =>
		long ? (
			<TextArea value={value} onInput={onChange} placeholder={placeholder} action={action} />
		) : (
			<TextInput value={value} onInput={onChange} placeholder={placeholder} action={action} />
		);

	// 没给预设的题只有一个框：答案全靠自己写
	if (options.length === 0) {
		return <Field label={question.label}>{answerBox(COPY.placeholder)}</Field>;
	}

	return (
		/* 摆着一排预设时里面是「一组选项」，不是一个控件（见 `Field` 的 `group`） */
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
				/* 窄屏外面那层卡片已经横向贴边，这一栏预设自己带一次 inset，才跟题面同一竖线；
				   从「自己写」退回预设时这一栏是淡进来的（FADE） */
				<div class={`flex gap-2 max-narrow:px-inset ${FADE} ${long ? 'flex-col' : 'flex-wrap'}`}>
					{options.map((option) => {
						const active = value === option;
						return (
							<button
								key={option}
								type="button"
								// 再点一下取消：留个「没答」的口子，不然选了就改不回去
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
