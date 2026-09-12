import type { CardData } from '../types';

// 题目的输入形态：单行、多行、单选
export type QuestionKind = 'text' | 'long' | 'choice';

// 答案的去处：结尾页上就这四块，写成一个字符串；那一行 / 那一块的名字取题面。
export type Placement = 'title' | 'footer' | 'meta' | 'block';

// 一道题：问卷是数据不是代码，加一份问卷只加数据，组件一行都不用改。
export interface Question {
	// 答案落到结尾页的哪里；不写就是只给 build 用；写在第一个，其余字段围着它转。
	into?: Placement;
	// 题目 id：既是答案的键，也是内容里那条元数据 / 文本块 id 的来源，不能重复
	id: string;
	// 题面文字
	label: string;
	kind: QuestionKind;
	// 预填的答案：答题框里一开始就写着它，它存的是真值、会一路印到结尾页上。
	default?: string;
	// 预设答案：给了它就有预设 / 自己写两个形态；单选横排成小按钮，多行竖排成整宽的一块块。
	options?: string[];
}

// 一份问卷的答案：题目 id → 用户填的字
export type Answers = Record<string, string>;

// 一份问卷 = 一个入口；不同领域各写一份，首页按 SURVEYS 的顺序铺卡片。
export interface Survey {
	// 问卷在地址里的名字，用小写 ASCII，不能占用保留名 outro 与向导的步骤地址。
	id: string;
	// 首页卡片上的名字
	title: string;
	// 首页卡片上的一句话说明
	description: string;
	// 题目。空数组是合法且有用的——那就是「编辑表单」：不用预设，直接进表单自己填。
	questions: Question[];
	// 答案 → 内容：默认按每道题的 into 搬运，需要加工时在这里写一个函数覆盖掉。
	build?: (answers: Answers) => Partial<CardData>;
}
