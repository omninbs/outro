import { COPY } from '../lib/copy';
import { FOOTER_MIN_HEIGHT, footerContainer } from '../lib/layout';
import { useRouter } from '../lib/router';
import { SUB_TEXT, TAP } from './ui';

/** 链接的统一样式：正文色，悬停转 blue 并加下划线（下划线那两笔参数见下面的注释） */
const LINK = `block cursor-pointer py-1 text-ctp-text hover:text-ctp-blue hover:underline decoration-[0.1em] underline-offset-[0.25em] ${TAP}`;

/** 源代码仓库：页脚「链接」里的那条外链，地址就是本仓库 */
const REPO_URL = 'https://github.com/omninbs/outro';

/**
 * 页脚：固定页面件，由 PageShell 统一挂，页面自己不用管（最终页除外）。
 *
 * 宽度写死在 layout 的 FOOTER_WIDTH（60rem，参考站页脚容器就是这一个数），
 * 不收 props、也不跟所在页面的容器走——首页列窄、表单页列宽，页脚要是跟着走就会一页一个样。
 *
 * 版式照 Catppuccin 那套来：mantle 底色、surface0 顶边、`3rem 0 1.5rem` 的内边距，
 * 里面分两栏（品牌 : 链接 = 7 : 5），大屏才并排，中型及以下上下排。
 * 两栏内容一律贴顶排：最小高度撑出来的余量留在下方，位置不随内容多寡浮动。
 * 链接默认用正文色，悬停转 blue 并加下划线——下划线加粗到 0.1em、下沉 0.25em，
 * 这两笔是参考站的做法，少了会显得糙。
 */
export function PageFooter() {
	const { navigate } = useRouter();

	return (
		<footer class="mt-auto border-t border-ctp-surface0 bg-ctp-mantle">
			<div
				class={`${footerContainer()} ${FOOTER_MIN_HEIGHT} flex flex-col gap-8 pt-12 pb-6 max-narrow:px-inset wide:flex-row wide:items-start wide:justify-between`}
			>
				<div class="wide:flex-[7]">
					<h2 class="mb-2 text-lg font-semibold tracking-wide text-ctp-subtext1">{COPY.brand}</h2>
					<p class={SUB_TEXT}>一个生成视频结尾信息页的小工具</p>
				</div>

				<nav class="wide:flex-[5]">
					<h3 class="mb-2 text-base font-semibold tracking-wide text-ctp-subtext1">链接</h3>
					<ul>
						<li>
							<button type="button" onClick={() => navigate('home')} class={LINK}>
								{COPY.action.backHome}
							</button>
						</li>
						<li>
							{/* 外链开新标签页：这个工具是拿来当片尾用的，中途跳走会丢掉正在填的内容 */}
							<a href={REPO_URL} target="_blank" rel="noreferrer" class={LINK}>
								源代码
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</footer>
	);
}
