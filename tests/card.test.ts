import { describe, expect, it } from 'vitest';

import { new_block, new_meta_item, remove_by_id, update_by_id } from '../src/lib/card';

describe('content array add/update/remove', () => {
	it('updates one item by id and leaves the others untouched', () => {
		const items = [new_meta_item('名称', '值'), new_meta_item('另一个', '值')];
		const next = update_by_id(items, items[1].id, { value: '改过' });

		expect(next[0]).toBe(items[0]);
		expect(next[1].value).toBe('改过');
		expect(items[1].value).toBe('值');
	});

	it('removes one item by id', () => {
		const items = [new_block('a', 'A'), new_block('b', 'B')];

		expect(remove_by_id(items, items[0].id)).toEqual([items[1]]);
	});
});
