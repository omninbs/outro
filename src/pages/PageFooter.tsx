import { COPY } from '../lib/copy';
import { FOOTER_MIN_HEIGHT, footer_container } from '../lib/layout';
import { LinkList, SUB_TEXT, HEADING } from '../components/ui';

// 页脚「链接」里那条外链指向的仓库
const REPO_URL = 'https://github.com/omninbs/outro';

// 页脚：由 PageShell 统一挂的固定件，宽度写死、不收 props；两栏只在放得下时才并排
export function PageFooter() {
	return (
		<footer class="mt-auto border-t border-ctp-surface0 bg-ctp-mantle">
			<div
				class={`${footer_container()} ${FOOTER_MIN_HEIGHT} flex flex-col gap-8 pt-12 pb-6 narrow:px-inset wide:flex-row wide:items-start wide:justify-between`}
			>
				<div class="flex flex-col gap-2 wide:flex-[7]">
					<h2 class={HEADING}>{COPY.brand}</h2>
					<p class={SUB_TEXT}>{COPY.tagline}</p>
				</div>

				<nav class="flex flex-col gap-2 wide:flex-[5]">
					<h2 class={HEADING}>{COPY.section.links}</h2>
					<LinkList
						items={[
							// 「返回主页」在应用内跳，「源代码」是外链
							{ text: COPY.action.back_home, href: '#' },
							{ text: COPY.action.source, href: REPO_URL, external: true },
						]}
					/>
				</nav>
			</div>
		</footer>
	);
}
