import { describe, expect, it } from 'vitest';

import { parseCard } from '../src/lib/persist';

describe('parseCard', () => {
	it('reads the current shape', () => {
		const raw = JSON.stringify({
			title: '标题',
			meta: [{ id: 'm1', label: '名称', value: '值' }],
			blocks: [{ id: 'b1', label: '小标题', text: '正文' }],
			footerText: '署名',
		});

		expect(parseCard(raw)).toEqual({
			title: '标题',
			meta: [{ id: 'm1', label: '名称', value: '值' }],
			blocks: [{ id: 'b1', label: '小标题', text: '正文' }],
			footerText: '署名',
		});
	});

	it('reads the fields of an old archive as metadata', () => {
		const card = parseCard(JSON.stringify({ fields: [{ id: 'm1', label: '名称', value: '值' }] }));

		expect(card.meta).toEqual([{ id: 'm1', label: '名称', value: '值' }]);
	});

	it('reads the notice of an old archive as one text block', () => {
		const card = parseCard(JSON.stringify({ notice: '正文', noticeLabel: '声明' }));

		expect(card.blocks).toEqual([{ id: expect.any(String), label: '声明', text: '正文' }]);
	});

	it('drops rows whose shape does not match', () => {
		const raw = JSON.stringify({ meta: [null, '名称', 7, { label: '名称', value: '值' }], blocks: [null] });
		const card = parseCard(raw);

		expect(card.meta).toHaveLength(1);
		expect(card.meta[0].value).toBe('值');
		expect(card.blocks).toEqual([]);
	});

	it('fills missing fields with empty strings and a new id, never passing undefined into rendering', () => {
		const card = parseCard(JSON.stringify({ meta: [{}] }));

		expect(card.meta[0].label).toBe('');
		expect(card.meta[0].value).toBe('');
		expect(card.meta[0].id).toMatch(/^m/);
	});

	it('gives empty content, not undefined, when a whole block has missing fields', () => {
		expect(parseCard('{}')).toEqual({ title: '', meta: [], blocks: [], footerText: '' });
	});

	it('reads an archive whose top level is not an object as empty too', () => {
		const empty = { title: '', meta: [], blocks: [], footerText: '' };

		expect(parseCard('null')).toEqual(empty);
		expect(parseCard('7')).toEqual(empty);
		expect(parseCard('"标题"')).toEqual(empty);
	});
});
