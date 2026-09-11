import { COPY } from '../lib/copy';
import { FOOTER_MIN_HEIGHT, footerContainer } from '../lib/layout';
import { LinkList, SUB_TEXT, HEADING } from './ui';

/** 页脚「链接」里那条外链指向的仓库 */
const REPO_URL = 'https://github.com/omninbs/outro';

/**
 * 页脚：由 PageShell 统一挂的固定件，页面自己不用管（最终页除外——它要整屏截图）。
 * 宽度写死、不收 props、也不跟页面容器走：跟着走就会一页一个样。底色比正文深一档、顶上收一道细线，跟内容分开。
 * 两栏只在放得下时才并排，里面的内容一律贴顶，撑出来的高度余量留在下方，位置不随内容多寡浮动。
 * 两栏的标题是并排的两件事、谁也不从属谁，所以跟页面标题同款；链接清单长什么样归 LinkList
 * 一处定义，这里只管两条链接指向哪、叫什么名字。
 */
export function PageFooter() {
	return (
		<footer class="mt-auto border-t border-ctp-surface0 bg-ctp-mantle">
			<div
				class={`${footerContainer()} ${FOOTER_MIN_HEIGHT} flex flex-col gap-8 pt-12 pb-6 narrow:px-inset wide:flex-row wide:items-start wide:justify-between`}
			>
				<div class="flex flex-col gap-2 wide:flex-[7]">
					<h2 class={HEADING}>{COPY.brand}</h2>
					<p class={SUB_TEXT}>一个生成视频结尾信息页的小工具</p>
				</div>

				<nav class="flex flex-col gap-2 wide:flex-[5]">
					<h2 class={HEADING}>{COPY.section.links}</h2>
					<LinkList
						items={[
							// 「返回主页」在应用内跳，「源代码」是外链
							{ text: COPY.action.backHome, href: '#' },
							{ text: COPY.action.source, href: REPO_URL, external: true },
						]}
					/>
				</nav>
			</div>
		</footer>
	);
}
