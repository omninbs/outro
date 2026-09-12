import { describe, expect, it } from 'vitest';

import { resolve_outro } from '../src/lib/outro';
import type { CardData } from '../src/lib/types';

const card_of = (card: Partial<CardData>): CardData => ({
	title: '',
	meta: [],
	blocks: [],
	footer_text: '',
	...card,
});

describe('resolve_outro', () => {
	it('trims leading and trailing whitespace', () => {
		const content = resolve_outro(card_of({ title: ' 标题 ', footer_text: ' 署名 ' }));

		expect(content.title).toBe('标题');
		expect(content.footer).toBe('署名');
	});

	it('hides empty answers entirely: left blank means not printed', () => {
		const content = resolve_outro(
			card_of({
				meta: [{ id: 'm', label: '名称', value: '   ' }],
				blocks: [{ id: 'b', label: '块', text: '' }],
			}),
		);

		expect(content.meta).toEqual([]);
		expect(content.blocks).toEqual([]);
	});

	it('lets a block label stay blank while the body is still printed', () => {
		const content = resolve_outro(card_of({ blocks: [{ id: 'b', label: '  ', text: '正文' }] }));

		expect(content.blocks).toEqual([{ id: 'b', label: '', text: '正文' }]);
	});
});
