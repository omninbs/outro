import { useRouter } from '../lib/router';
import { Button, Panel } from './ui';

/**
 * 首页：只做一件事——选从哪条路开始。
 *
 * 「空预设」就是表单页本身（`#form`）；「问卷」还没做，先把入口摆在这里，
 * 按钮置灰，免得看着像坏了。
 */
export function HomePage() {
	const { navigate } = useRouter();

	return (
		<div class="mx-auto w-full max-w-360 px-6 py-8">
			<header class="mb-6">
				<h1 class="text-lg font-semibold">结尾页生成器</h1>
				<p class="mt-1 text-base text-ctp-subtext0">选一种开始方式</p>
			</header>

			<div class="grid items-start gap-6 landscape:grid-cols-2">
				<Panel title="空预设">
					<p class="mb-4 text-base leading-relaxed text-ctp-subtext0">
						从一张白纸开始：标题、元数据、文本块都由你自己写。
					</p>
					<Button variant="primary" onClick={() => navigate('form')}>
						开始填写
					</Button>
				</Panel>

				<Panel title="问卷">
					<p class="mb-4 text-base leading-relaxed text-ctp-subtext0">
						按问题回答，由工具整理成结尾页内容。这个还没做，入口先留着。
					</p>
					<Button disabled>开始问卷</Button>
				</Panel>
			</div>
		</div>
	);
}
