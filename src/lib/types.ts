import type { AccentName, FlavorName } from './palette';

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
	flavor: FlavorName;
	accent: AccentName;
	textScale: number;
	footerOn: boolean;
	footerText: string;
}
