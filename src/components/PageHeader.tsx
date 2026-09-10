import { HEADING } from './ui';

/**
 * 页面标题块：一个标题 + 一句说明。首页、问卷页、向导页、认不出问卷时的页面共用这一套。
 *
 * 收成组件而不是类名常量：这四处的结构（header + h1 + p）和排版本来就是一回事，
 * 抄四遍意味着以后改字号要改四个地方，还会漏掉其中一个。
 * 标题那行字取 `HEADING`——页脚两栏的标题跟它同款，一处改两处跟着走。
 */
export function PageHeader({ title, description }: { title: string; description: string }) {
	return (
		/* 窄屏外面那层页面容器已经横向贴边（见 layout 的 container），所以标题块自己带一次 inset */
		<header class="mb-6 max-narrow:px-inset">
			<h1 class={HEADING}>{title}</h1>
			<p class="mt-1 text-base text-ctp-subtext0">{description}</p>
		</header>
	);
}
