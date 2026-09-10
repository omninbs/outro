export type FooterLink = { label: string; onClick: () => void };

/**
 * 页脚：首页与表单页收尾都用它，最终页没有——那一页要整屏截图，页脚会入画。
 *
 * 风格照 Catppuccin 来：一条 surface0 分隔线，说明文字用 overlay0，
 * 可点的链接用 mauve、悬停加下划线；不铺背景色块，免得跟页面里的卡片抢视觉。
 * 内容不满一屏时也要落在窗口底部，靠外层 flex 列的 mt-auto 顶下去——
 * 调用方的容器得是 `flex flex-1 flex-col`。
 */
export function PageFooter({ links = [] }: { links?: FooterLink[] }) {
	return (
		<footer class="mt-auto pt-12 text-base text-ctp-overlay0">
			<div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-ctp-surface0 pt-5">
				<p>内容只保存在这台设备的浏览器里</p>

				{links.length > 0 && (
					<nav class="flex flex-wrap gap-x-5 gap-y-2">
						{links.map((link) => (
							<button
								key={link.label}
								type="button"
								onClick={link.onClick}
								class="cursor-pointer text-ctp-mauve transition hover:underline"
							>
								{link.label}
							</button>
						))}
					</nav>
				)}
			</div>
		</footer>
	);
}
