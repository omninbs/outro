import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
	// 相对路径产物 + JS/CSS 全部内联：dist/index.html 可以直接双击用 file:// 打开
	base: './',
	plugins: [preact(), tailwindcss(), viteSingleFile()],
});
