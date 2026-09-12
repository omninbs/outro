import { describe, expect, it } from 'vitest';

import { resolveOutro } from '../src/lib/outro';
import type { CardData } from '../src/lib/types';

const cardOf = (card: Partial<CardData>): CardData => ({
	title: '',
	meta: [],
	blocks: [],
	footerText: '',
	...card,
});

describe('resolveOutro', () => {
	it('trims leading and trailing whitespace', () => {
		const content = resolveOutro(cardOf({ title: ' 标题 ', footerText: ' 署名 ' }));

		expect(content.title).toBe('标题');
		expect(content.footer).toBe('署名');
	});

	it('hides empty answers entirely: left blank means not printed', () => {
		const content = resolveOutro(
			cardOf({
				meta: [{ id: 'm', label: '名称', value: '   ' }],
				blocks: [{ id: 'b', label: '块', text: '' }],
			}),
		);

		expect(content.meta).toEqual([]);
		expect(content.blocks).toEqual([]);
	});

	it('lets a block label stay blank while the body is still printed', () => {
		const content = resolveOutro(cardOf({ blocks: [{ id: 'b', label: '  ', text: '正文' }] }));

		expect(content.blocks).toEqual([{ id: 'b', label: '', text: '正文' }]);
	});
});
