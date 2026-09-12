import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';

import { Field, FADE, IconButton, HOVER, TextArea, TextInput } from '../ui';

// 预设的选中外观：横排的词与竖排的段落共用一套
const tone = (active: boolean) =>
	active
		? 'border-ctp-mauve bg-ctp-mauve/10 text-ctp-text'
		: 'border-ctp-surface1 text-ctp-subtext0 press:text-ctp-text';

// 词级预设横排：单选的取值都是词，一列扫过去就看完
const PILL = `rounded-md border px-3 py-1.5 text-base ${HOVER}`;

// 段落级预设整宽竖排：照多行框排，换行也照原样排出来
const BLOCK = `w-full rounded-md border px-3 py-3 text-left text-base leading-relaxed whitespace-pre-wrap ${HOVER}`;

// 「自定义」不是一条预设，是另一种输入形态，长相上要跟预设分得开
const CUSTOM =
	'rounded-md border border-dashed border-ctp-surface1 text-base text-ctp-subtext0 ' +
	`${HOVER} press:border-ctp-mauve press:text-ctp-mauve`;

// 一道题的答题控件：只认题面与预设，不认问卷怎么定义；带预设的题靠「自定义」在两个形态间切换
export function QuestionInput({
	label,
	long,
	options = [],
	value,
	on_change,
	placeholder,
}: {
	label: string;
	// 长答用多行框，预设也竖排成整宽
	long?: boolean;
	options?: string[];
	value: string;
	on_change: (value: string) => void;
	placeholder: string;
}) {
	const [custom, set_custom] = useState(() => value !== '' && !options.includes(value));
	// 叉掉时放回的那一项：× 是撤销，不是清空
	const [revert_to, set_revert_to] = useState('');

	// 当前题的框：形态跟着答案的形状走
	const answer_box = (hint: string, action?: ComponentChildren) =>
		long ? (
			<TextArea value={value} on_input={on_change} placeholder={hint} action={action} />
		) : (
			<TextInput value={value} on_input={on_change} placeholder={hint} action={action} />
		);

	if (options.length === 0) {
		return <Field label={label}>{answer_box(placeholder)}</Field>;
	}

	return (
		// 一排预设是「一组选项」而非一个控件，标签只该包一个控件；
		// 窄屏贴边的卡片不提供横向留白，这一栏自己带一次以对齐题面
		<Field label={label} group={!custom}>
			{custom ? (
				answer_box(
					'自己写',
					<IconButton
						label="退回选项"
						on_click={() => {
							on_change(revert_to);
							set_custom(false);
						}}
					/>,
				)
			) : (
				<div class={`flex gap-2 narrow:px-inset ${FADE} ${long ? 'flex-col' : 'flex-wrap'}`}>
					{options.map((option) => {
						const active = value === option;
						return (
							<button
								key={option}
								type="button"
								onClick={() => on_change(active ? '' : option)}
								class={`${long ? BLOCK : PILL} ${tone(active)}`}
							>
								{option}
							</button>
						);
					})}
					<button
						type="button"
						onClick={() => {
							set_revert_to(value);
							set_custom(true);
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
