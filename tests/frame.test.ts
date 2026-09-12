import { describe, expect, it } from 'vitest';

import { frameOf } from '../src/lib/frame';

const box = (width: number, height: number) => ({ width, height });
const ratioOf = (frame: { width: number; height: number }) => frame.width / frame.height;

describe('frameOf', () => {
	it('keeps the ratio exact', () => {
		for (const aspect of [2 / 3, 1, 3 / 2]) {
			for (const size of [box(416, 200), box(416, 900), box(720, 480), box(100, 100)]) {
				expect(ratioOf(frameOf(aspect, size))).toBeCloseTo(aspect, 10);
			}
		}
	});

	it('treats the margin as a lower bound: both sides get at least a quarter of the longer side', () => {
		for (const size of [box(416, 900), box(720, 480), box(300, 300)]) {
			const frame = frameOf(1, size);
			const margin = 0.25 * Math.max(size.width, size.height);

			expect(frame.width).toBeGreaterThanOrEqual(size.width + 2 * margin - 1e-9);
			expect(frame.height).toBeGreaterThanOrEqual(size.height + 2 * margin - 1e-9);
		}
	});

	it('only grows the canvas for taller content and never squeezes it out', () => {
		const short = frameOf(3 / 2, box(720, 300));
		const tall = frameOf(3 / 2, box(720, 600));

		expect(tall.height).toBeGreaterThan(short.height);
		expect(tall.width).toBeGreaterThan(short.width);
	});

	it('opens up wide flat content by width: the shorter side is stretched to the ratio', () => {
		const frame = frameOf(1, box(400, 100));

		expect(frame.width).toBe(400 + 0.5 * 400);
		expect(frame.height).toBe(frame.width);
	});
});
