// 一条元数据（宽档下排在结尾页主体左边那一栏）
export interface MetaItem {
	id: string;
	label: string;
	value: string;
}

// 一块长文本（宽档下排在结尾页主体右边那一栏）
export interface TextBlock {
	id: string;
	label: string;
	text: string;
}

export interface CardData {
	title: string;
	meta: MetaItem[];
	blocks: TextBlock[];
	footer_text: string;
}

// 局部更新内容：步骤组件用它改自己那一部分
export type Patch = (next: Partial<CardData>) => void;
