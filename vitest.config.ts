import { defineConfig } from 'vitest/config';

/**
 * 单测只碰**纯函数**——数据搬运、存档迁移、内容过滤，都不经过 DOM 与样式，
 * 所以这里不带应用那套插件（Preact、Tailwind、单文件产物）：测的是源码本身，不是构建产物。
 */
export default defineConfig({
	test: {
		include: ['tests/**/*.test.ts'],
	},
});
