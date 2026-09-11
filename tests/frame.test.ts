import { describe, expect, it } from 'vitest';

import { frameOf } from '../src/lib/frame';

const box = (width: number, height: number) => ({ width, height });
const ratioOf = (frame: { width: number; height: number }) => frame.width / frame.height;

describe('frameOf', () => {
	it('比例永远是对的', () => {
		for (const aspect of [2 / 3, 1, 3 / 2]) {
			for (const size of [box(416, 200), box(416, 900), box(720, 480), box(100, 100)]) {
				expect(ratioOf(frameOf(aspect, size))).toBeCloseTo(aspect, 10);
			}
		}
	});

	it('四周留白是下限：两条边留出来的都不少于较长边的四分之一', () => {
		for (const size of [box(416, 900), box(720, 480), box(300, 300)]) {
			const frame = frameOf(1, size);
			const margin = 0.25 * Math.max(size.width, size.height);

			expect(frame.width).toBeGreaterThanOrEqual(size.width + 2 * margin - 1e-9);
			expect(frame.height).toBeGreaterThanOrEqual(size.height + 2 * margin - 1e-9);
		}
	});

	it('内容更长，画布只会更大，不会把内容挤掉', () => {
		const short = frameOf(3 / 2, box(720, 300));
		const tall = frameOf(3 / 2, box(720, 600));

		expect(tall.height).toBeGreaterThan(short.height);
		expect(tall.width).toBeGreaterThan(short.width);
	});

	it('宽扁的内容由宽撑开：短的一条被撑到长宽比上', () => {
		const frame = frameOf(1, box(400, 100));

		expect(frame.width).toBe(400 + 0.5 * 400);
		expect(frame.height).toBe(frame.width);
	});
});
