import { describe, expect, it } from 'vitest';

import { newBlock, newMetaItem, removeById, updateById } from '../src/lib/card';

describe('content array add/update/remove', () => {
	it('updates one item by id and leaves the others untouched', () => {
		const items = [newMetaItem('名称', '值'), newMetaItem('另一个', '值')];
		const next = updateById(items, items[1].id, { value: '改过' });

		expect(next[0]).toBe(items[0]);
		expect(next[1].value).toBe('改过');
		expect(items[1].value).toBe('值');
	});

	it('removes one item by id', () => {
		const items = [newBlock('a', 'A'), newBlock('b', 'B')];

		expect(removeById(items, items[0].id)).toEqual([items[1]]);
	});
});
