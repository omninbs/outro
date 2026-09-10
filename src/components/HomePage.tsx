import { useRouter } from '../lib/router';
import { Panel } from './ui';

/**
 * 首页：只做一件事——选从哪条路开始。
 *
 * 整块卡片就是入口，没有按钮：「空预设」进表单页（`#form`）；
 * 「问卷」还没做，所以那张卡片不可点，免得看着像坏了。
 */
export function HomePage() {
	const { navigate } = useRouter();

	return (
		<div class="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-12">
			<header class="mb-6">
				<h1 class="text-lg font-semibold">结尾页生成器</h1>
				<p class="mt-1 text-base text-ctp-subtext0">选一种开始方式</p>
			</header>

			<div class="space-y-6">
				<Panel title="空预设" onClick={() => navigate('form')}>
					<p class="text-base leading-relaxed text-ctp-subtext0">
						从一张白纸开始：标题、元数据、文本块都由你自己写。
					</p>
				</Panel>

				<Panel title="问卷">
					<p class="text-base leading-relaxed text-ctp-subtext0">
						按问题回答，由工具整理成结尾页内容。这个还没做，入口先留着。
					</p>
				</Panel>
			</div>
		</div>
	);
}
