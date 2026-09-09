export interface Field {
	id: string;
	label: string;
	value: string;
}

export interface CardData {
	title: string;
	fields: Field[];
	noticeLabel: string;
	notice: string;
	footerText: string;
}
