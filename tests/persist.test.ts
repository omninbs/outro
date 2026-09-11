import { describe, expect, it } from 'vitest';

import { parseCard } from '../src/lib/persist';

describe('parseCard', () => {
	it('读得出当前结构', () => {
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

	it('把旧档的 fields 当成元数据读', () => {
		const card = parseCard(JSON.stringify({ fields: [{ id: 'm1', label: '名称', value: '值' }] }));

		expect(card.meta).toEqual([{ id: 'm1', label: '名称', value: '值' }]);
	});

	it('把旧档那段声明读成一个文本块', () => {
		const card = parseCard(JSON.stringify({ notice: '正文', noticeLabel: '声明' }));

		expect(card.blocks).toEqual([{ id: expect.any(String), label: '声明', text: '正文' }]);
	});

	it('形状对不上的条目整条丢掉', () => {
		const raw = JSON.stringify({ meta: [null, '名称', 7, { label: '名称', value: '值' }], blocks: [null] });
		const card = parseCard(raw);

		expect(card.meta).toHaveLength(1);
		expect(card.meta[0].value).toBe('值');
		expect(card.blocks).toEqual([]);
	});

	it('缺字段的条目补成空串与一个新 id，不把 undefined 带进渲染', () => {
		const card = parseCard(JSON.stringify({ meta: [{}] }));

		expect(card.meta[0].label).toBe('');
		expect(card.meta[0].value).toBe('');
		expect(card.meta[0].id).toMatch(/^m/);
	});

	it('整块缺字段时给的是空内容，不是 undefined', () => {
		expect(parseCard('{}')).toEqual({ title: '', meta: [], blocks: [], footerText: '' });
	});

	it('存档顶层不是一个对象时同样按空档读', () => {
		const empty = { title: '', meta: [], blocks: [], footerText: '' };

		expect(parseCard('null')).toEqual(empty);
		expect(parseCard('7')).toEqual(empty);
		expect(parseCard('"标题"')).toEqual(empty);
	});
});
