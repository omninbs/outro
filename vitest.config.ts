import { defineConfig } from 'vitest/config';

// 单测只碰纯函数，不经过 DOM 与样式，所以这里不带应用那套插件
export default defineConfig({
	test: {
		include: ['tests/**/*.test.ts'],
	},
});
