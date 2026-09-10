import type { CardData } from '../types';
import type { Answers, Question, Survey } from './types';

/**
 * 内容里那条元数据 / 文本块的 id 由题目 id 推出来，不用随机 id。
 *
 * 两个原因：一是答案每改一个字都要重算一遍预览，随机 id 会让清单每次都换 key、
 * 整列重挂载；二是 id 稳定，改完答案再回表单编辑时，行的身份前后一致。
 * 前缀带横杠（`m-` / `b-`）是为了跟随机 id（`m` + 时间戳）区分开，不会撞。
 */
const metaId = (question: Question) => `m-${question.id}`;
const blockId = (question: Question) => `b-${question.id}`;

/**
 * 按每道题的 `into` 把答案搬成内容——纯函数，不碰状态也不碰 DOM。
 *
 * 空白答案整条丢掉：没答的题不该在结尾页留一行空标签。
 * `into` 没写 `label` 就用题面当标签（见 `Placement`）。
 * 同一去处写多次时后者覆盖前者（标题、页脚），元数据与文本块则按题目顺序堆叠。
 */
export function buildCard(survey: Survey, answers: Answers): CardData {
	const card: CardData = { title: '', meta: [], blocks: [], footerText: '' };

	for (const question of survey.questions) {
		const into = question.into;
		const value = (answers[question.id] ?? '').trim();
		if (!into || !value) continue;

		switch (into.kind) {
			case 'title':
				card.title = value;
				break;
			case 'footer':
				card.footerText = value;
				break;
			case 'meta':
				card.meta.push({ id: metaId(question), label: into.label ?? question.label, value });
				break;
			case 'block':
				card.blocks.push({
					id: blockId(question),
					label: into.label ?? question.label,
					text: value,
				});
				break;
		}
	}

	return card;
}

/** 问卷的答案 → 内容：问卷自带 `build` 就用它，否则按每道题的 `into` 搬运 */
export const buildFrom = (survey: Survey, answers: Answers): CardData =>
	survey.build ? survey.build(answers) : buildCard(survey, answers);
