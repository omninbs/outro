import { HEADING } from './ui';

/**
 * 页面标题块：一个标题 + 一句说明，几个页面共用这一套——这几处本来就是一回事，抄几遍迟早各自漂走。
 * 标题字样与页脚那两栏同款：同一个层级就该长同一个样。
 */
export function PageHeader({ title, description }: { title: string; description: string }) {
	return (
		/* 窄屏容器横向贴边，留白得由文字自己带一次 */
		<header class="mb-6 max-narrow:px-inset">
			<h1 class={HEADING}>{title}</h1>
			<p class="mt-1 text-base text-ctp-subtext0">{description}</p>
		</header>
	);
}
