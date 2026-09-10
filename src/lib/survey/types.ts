import type { CardData } from '../types';

/** 题目的输入形态：单行、多行、单选 */
export type QuestionKind = 'text' | 'long' | 'choice';

/**
 * 答案的去处：结尾页上就这四块，写成一个字符串。
 *
 * 结尾页上那一行 / 那一块的名字取题面（`Question.label`）——「换个叫法」是另一件事，
 * 真需要时再加字段。2026-09 它原本是 `{ kind, label? }`，11 道题一处都没写过 `label`，
 * 于是那层对象只剩包装，压成了字符串。
 */
export type Placement = 'title' | 'footer' | 'meta' | 'block';

/**
 * 一道题。
 *
 * 问卷是数据不是代码：题目、输入形态、答案的去处都写在数据里，
 * 加一份问卷只加数据，组件一行都不用改。
 */
export interface Question {
	/**
	 * 答案落到结尾页的哪里。不写就是「只给 build 用」——
	 * 比如用来算标题、拼一段说明的中间问题，自己不该出现在内容里。
	 *
	 * 写在**第一个**：一份问卷是拿结尾页倒着写出来的，先说这块答案印到哪儿，
	 * 剩下的 id / 题面 / 形态 / 预填值都围着它转（数据里照这个顺序写）。
	 */
	into?: Placement;
	/** 题目 id：既是答案的键，也是内容里那条元数据 / 文本块 id 的来源，一份问卷内不能重复 */
	id: string;
	/** 题面文字 */
	label: string;
	kind: QuestionKind;
	/**
	 * 预填的答案：答题框里一开始就写着它，用户想要别的就自己改掉。
	 *
	 * 它存的是**真值**，会一路印到结尾页上。想表达「默认不显示这一行」就别写它——
	 * 空答案本来就不印，框里的灰字（「不显示」）由组件统一给，不是数据。
	 */
	default?: string;
	/**
	 * 预设答案：给了它这道题就有两个形态（预设 / 自己写），答题时点「自定义」照样能自己写。
	 * 选项表是常用值不是全集——它只负责省一遍打字，不限制答案能是什么。
	 *
	 * 单选（`choice`）的取值都是词，横着排成小按钮；多行题（`long`）的预设是**一整段**现成的文字，
	 * 竖着排成整宽的一块块（横排会挤成小方块），点一条就整段填进多行框。
	 */
	options?: string[];
}

/** 一份问卷的答案：题目 id → 用户填的字 */
export type Answers = Record<string, string>;

/**
 * 一份问卷 = 一个入口。不同领域各写一份，首页按 `SURVEYS` 的顺序铺卡片；
 * 第一份「编辑表单」的 `questions` 是空的，那是「不用预设、自己填」那条路。
 */
export interface Survey {
	/**
	 * 问卷在地址里的名字（`#edit`、`#logic-redstone-music`），用小写 ASCII。
	 * 不能占用保留名 `form` / `outro`；首页是空 hash，也用不了。
	 */
	id: string;
	/** 首页卡片上的名字 */
	title: string;
	/** 首页卡片上的一句话说明 */
	description: string;
	/**
	 * 题目。空数组是合法且有用的一种——那就是「编辑表单」：
	 * 不用预设，点进去直接进表单自己填。
	 */
	questions: Question[];
	/**
	 * 答案 → 内容。默认按每道题的 `into` 搬运（见 `buildCard`）；
	 * 需要拼接、算标题这类加工时，在这里写一个函数覆盖掉。
	 *
	 * 返回的是**局部**内容：没提到的字段保持默认值（`DEFAULT_CARD`），
	 * 只有问卷问到的地方才盖上去——整份替换由 `buildFrom` 一处做。
	 */
	build?: (answers: Answers) => Partial<CardData>;
}
