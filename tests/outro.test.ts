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
	it('去掉首尾空白', () => {
		const content = resolveOutro(cardOf({ title: ' 标题 ', footerText: ' 署名 ' }));

		expect(content.title).toBe('标题');
		expect(content.footer).toBe('署名');
	});

	it('空答案整个不出现：留空就是不印', () => {
		const content = resolveOutro(
			cardOf({
				meta: [{ id: 'm', label: '名称', value: '   ' }],
				blocks: [{ id: 'b', label: '块', text: '' }],
			}),
		);

		expect(content.meta).toEqual([]);
		expect(content.blocks).toEqual([]);
	});

	it('小标题可以先留空，正文照印', () => {
		const content = resolveOutro(cardOf({ blocks: [{ id: 'b', label: '  ', text: '正文' }] }));

		expect(content.blocks).toEqual([{ id: 'b', label: '', text: '正文' }]);
	});
});
