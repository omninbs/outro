import { COPY } from '../lib/copy';
import { FOOTER_MIN_HEIGHT, footerContainer } from '../lib/layout';
import { LinkList, SUB_TEXT, HEADING } from './ui';

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
 *
 * 两栏的标题（品牌名、「链接」）是**并排的两个标题**，谁也不从属谁：都用 `HEADING`、都写 `h2`，
 * 也就是跟页面标题同一款字样——原来品牌是 `h2 + text-lg`、链接是 `h3 + text-base`，
 * 看着像一个管着另一个（2026-09 统一，原来还试过把两个都压到卡片小标题那一档，太轻）。
 *
 * 两条链接交给 `LinkList`（整行可点的链接清单，含它自己的 `<ul>` / `<li>` 语义），
 * 样式只有那一个定义；这里只管它们指向哪、叫什么名字——「返回主页」指应用内的首页，
 * 「源代码」是外链。
 */
export function PageFooter() {
	return (
		<footer class="mt-auto border-t border-ctp-surface0 bg-ctp-mantle">
			<div
				class={`${footerContainer()} ${FOOTER_MIN_HEIGHT} flex flex-col gap-8 pt-12 pb-6 max-narrow:px-inset wide:flex-row wide:items-start wide:justify-between`}
			>
				<div class="wide:flex-[7]">
					<h2 class={`mb-2 ${HEADING}`}>{COPY.brand}</h2>
					<p class={SUB_TEXT}>一个生成视频结尾信息页的小工具</p>
				</div>

				<nav class="wide:flex-[5]">
					<h2 class={`mb-2 ${HEADING}`}>链接</h2>
					<LinkList
						items={[
							// 「返回主页」指应用内的首页，就是那个空 fragment 的 `#`；路由认它
							{ text: COPY.action.backHome, href: '#' },
							{ text: '源代码', href: REPO_URL, external: true },
						]}
					/>
				</nav>
			</div>
		</footer>
	);
}
