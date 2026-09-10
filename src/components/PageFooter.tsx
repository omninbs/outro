import { useRouter } from '../lib/router';

/**
 * 页脚：标准页面件，首页和表单页一模一样，最终页没有——那一页要整屏截图，页脚会入画。
 *
 * 自己读路由，不收 props：既然每个页面都长一样，让调用方传东西进来只会长出差异。
 * 样式照 Catppuccin 来：一条 surface0 分隔线，链接用 mauve、悬停加下划线；
 * 不铺背景色块，免得跟页面里的卡片抢视觉。
 * 内容不满一屏时也要落在窗口底部，靠外层 flex 列的 mt-auto 顶下去——
 * 调用方的容器得是 `flex flex-1 flex-col`。
 */
export function PageFooter() {
	const { navigate } = useRouter();

	return (
		<footer class="mt-auto pt-12 text-base text-ctp-overlay0">
			<nav class="flex items-center justify-end gap-x-5 border-t border-ctp-surface0 pt-5">
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
