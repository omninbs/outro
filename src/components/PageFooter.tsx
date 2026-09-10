import { pageContainer, type PageWidth } from '../lib/layout';
import { useRouter } from '../lib/router';

/**
 * 页脚：标准页面件，由 PageShell 统一挂，页面自己不用管（最终页除外）。
 *
 * 版式照 Catppuccin 官网那套来：mantle 底色、surface0 顶边、`3rem 0 1.5rem` 的内边距，
 * 里面分两栏（品牌 : 链接 = 7 : 5），窄屏自动改成上下排。
 * 链接默认用正文色，悬停转 blue 并加下划线——下划线加粗到 0.1em、下沉 0.25em，
 * 这两笔是参考站的做法，少了会显得糙。
 * 容器宽度由 PageShell 传进来，跟同页内容用同一个 pageContainer，不会比内容宽或窄。
 */
export function PageFooter({ width }: { width: PageWidth }) {
	const { navigate } = useRouter();

	return (
		<footer class="mt-auto border-t border-ctp-surface0 bg-ctp-mantle">
			<div
				class={`${pageContainer(width)} flex flex-col gap-8 pt-12 pb-6 landscape:flex-row landscape:justify-between`}
			>
				<div class="landscape:flex-[7]">
					<h2 class="mb-2 text-lg font-semibold tracking-wide text-ctp-subtext1">结尾页生成器</h2>
				</div>

				<nav class="landscape:flex-[5]">
					<h3 class="mb-2 text-base font-semibold tracking-wide text-ctp-subtext1">链接</h3>
					<ul>
						<li>
							<button
								type="button"
								onClick={() => navigate('home')}
								class="block cursor-pointer py-1 text-ctp-text transition hover:text-ctp-blue hover:underline decoration-[0.1em] underline-offset-[0.25em]"
							>
								返回主页
							</button>
						</li>
					</ul>
				</nav>
			</div>
		</footer>
	);
}
