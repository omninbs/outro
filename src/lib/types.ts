/** 主体左栏的一条元数据 */
export interface MetaItem {
	id: string;
	label: string;
	value: string;
}

/** 主体右栏的一块长文本 */
export interface TextBlock {
	id: string;
	label: string;
	text: string;
}

export interface CardData {
	title: string;
	meta: MetaItem[];
	blocks: TextBlock[];
	footerText: string;
}
