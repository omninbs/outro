import { useRouter } from '../lib/router';

/**
 * 页脚：标准页面件，由 PageShell 统一挂，页面自己不用管（最终页除外）。
 *
 * 宽度与内边距写在这里，不跟着各页内容列走：首页列窄（max-w-2xl）、表单页列宽（max-w-360），
 * 页脚要是继承各自那一列，两个页面的分隔线和链接就会对不齐。
 * 所以分隔线铺满整幅，链接放在自己那个和表单页同宽的居中容器里，每页都一样。
 *
 * 样式照 Catppuccin 来：surface0 分隔线、overlay0 文字、mauve 链接配悬停下划线。
 */
export function PageFooter() {
	const { navigate } = useRouter();

	return (
		<footer class="mt-auto border-t border-ctp-surface0">
			<nav class="mx-auto flex w-full max-w-360 items-center justify-end px-6 py-5 text-base text-ctp-overlay0">
				<button
					type="button"
					onClick={() => navigate('home')}
					class="cursor-pointer text-ctp-mauve transition hover:underline"
				>
					返回主页
				</button>
			</nav>
		</footer>
	);
}
