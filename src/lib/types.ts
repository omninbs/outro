import type { AccentName, FlavorName } from './palette';

export type RatioId = '16:9' | '21:9' | '1:1' | '4:3' | '9:16';

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
	ratio: RatioId;
	footerOn: boolean;
	footerText: string;
}
