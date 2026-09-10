import type { CardData } from '../types';

/** 题目的输入形态：单行、多行、单选 */
export type QuestionKind = 'text' | 'long' | 'choice';

/**
 * 答案的去处：结尾页上就这四块。
 *
 * `meta` / `block` 带 `label`，因为结尾页左栏每行、右栏每块都得有个名字；
 * 名字写在数据里，问卷作者不用去管渲染。
 */
export type Placement =
	| { kind: 'title' }
	| { kind: 'footer' }
	| { kind: 'meta'; label: string }
	| { kind: 'block'; label: string };

/**
 * 一道题。
 *
 * 问卷是数据不是代码：题目、输入形态、答案的去处都写在数据里，
 * 加一份问卷只加数据，组件一行都不用改。
 */
export interface Question {
	/** 题目 id：既是答案的键，也是内容里那条元数据 / 文本块 id 的来源，一份问卷内不能重复 */
	id: string;
	/** 题面文字 */
	label: string;
	kind: QuestionKind;
	/** 答题框里的占位提示 */
	placeholder?: string;
	/** `kind: 'choice'` 的选项 */
	options?: string[];
	/** `kind: 'long'` 的行数，默认 5 */
	rows?: number;
	/**
	 * 答案落到结尾页的哪里。不写就是「只给 build 用」——
	 * 比如用来算标题、拼一段说明的中间问题，自己不该出现在内容里。
	 */
	into?: Placement;
}

/** 一份问卷的答案：题目 id → 用户填的字 */
export type Answers = Record<string, string>;

/**
 * 一份问卷 = 一个入口。不同领域各写一份，首页按 `SURVEYS` 的顺序铺卡片。
 */
export interface Survey {
	/**
	 * 问卷在地址里的名字（`#demo`），用小写 ASCII。
	 * 不能占用保留名 `form` / `outro`；首页是空 hash，也用不了。
	 */
	id: string;
	/** 首页卡片上的名字 */
	title: string;
	/** 首页卡片上的一句话说明 */
	description: string;
	/**
	 * 题目。空数组是合法且有用的一种：那就是「空预设」——
	 * 最自由的一份问卷，没有引导，点进去直接进表单从零填。
	 */
	questions: Question[];
	/**
	 * 答案 → 内容。默认按每道题的 `into` 搬运（见 `buildCard`）；
	 * 需要拼接、算标题这类加工时，在这里写一个函数覆盖掉。
	 */
	build?: (answers: Answers) => CardData;
}
