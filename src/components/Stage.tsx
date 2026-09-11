import { useEffect, useRef } from 'preact/hooks';

import { OutroPage } from './OutroPage';
import { PageShell } from './PageShell';
import type { OutputPreset } from '../lib/image';
import type { CardData } from '../lib/types';

/**
 * 取景台：把结尾页按 `preset.viewport` 的宽度排一份出来，好让 `saveImage` 把它装进画布。
 *
 * **只有台子这一圈写死宽度**：它把档位与排版条件定死，跟观者的窗口无关。
 * 卡片自己照旧按页面那套规矩定宽（「一行要多宽」那个上限里的居中块），进台子不换宽度——
 * 台子要是顺手把它撑到设计宽，存出来的就跟预览里那一份不是同一个东西了。
 * 台子又是最终页版面的量具——档位量的是离得最近的那一层容器的内联尺寸（页面里量到的是页面宽），
 * 这里量到的就是台子宽。于是这一档排出来的是什么，跟观者的窗口一点关系都没有。
 * 台子自己不再声明容器：量具只有「管宽的那一层」，多一层容器只会让查询落到更里面、
 * 量到更窄的那个数上（2026-09 在取景台里量到的一直是页面的宽度，就是多了一层）。
 * 高度归内容自己长，所以量出来的那一份就是图里那一份。
 *
 * 排的这一份只在屏幕外：整块缩到能塞进视口里，再往左上方挪出视野——视口比屏幕宽的那些档
 * （宽档要 1148）缩完仍有好几千像素，收成一份小的就既不会长出滚动条、也不给页面添横向溢出。
 * 缩放只影响画出来的样子，量排版尺寸（`offsetWidth`）与克隆都按原尺寸，所以图里那份跟这一份一样。
 * 它自己也不是给人看的：`aria-hidden`，指针事件一并关掉。
 */
export function Stage({ preset, data, onCard }: { preset: OutputPreset; data: CardData; onCard: (card: HTMLElement) => void }) {
	const root = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const card = root.current?.querySelector<HTMLElement>('[data-card]');
		if (card) onCard(card);
	}, [onCard]);

	// 缩放比取两头的较小者：整份要放得进视口，缩放后的横向宽高又得撑得住祖先的溢出区
	const fit = Math.min(1, (window.innerWidth - 1) / preset.viewport, 300 / preset.viewport, 300 / window.innerHeight);

	return (
		<div
			ref={root}
			aria-hidden="true"
			class="pointer-events-none fixed top-0 left-0 -translate-x-full -translate-y-full"
			style={{ overflow: 'hidden', width: `${preset.viewport}px`, transform: `scale(${fit})` }}
		>
			<PageShell theme="latte" width={null} footer={false}>
				<OutroPage data={data} />
			</PageShell>
		</div>
	);
}
