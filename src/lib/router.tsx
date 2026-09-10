import { createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';

/**
 * 视图状态：应用只有「填写」（wizard）和「结尾页」（outro）两个页面。
 *
 * 用 hash 记录当前视图，判断规则只有一条：地址里出现 `#outro` 就是最终页，其余都是向导。
 * 用 hash 而不是路径，是因为改 hash 不触发导航，构建产物直接用浏览器打开（file://）时
 * 照样能用、能刷新、能前进后退；路径路由在 file:// 下会直接失败。
 */
export type View = 'wizard' | 'outro';

const OUTRO_HASH = 'outro';

function readView(): View {
	const name = window.location.hash.slice(1).trim().toLowerCase();
	return name === OUTRO_HASH ? 'outro' : 'wizard';
}

function writeView(view: View) {
	// 回向导时赋空字符串，只会留下一个「空的 fragment」，地址栏里就是那个 `#`。
	// 用 replaceState 自己拼路径能抹掉它，但要动 History API + 显式路径，file:// 下不值当，保留 `#`。
	window.location.hash = view === 'outro' ? OUTRO_HASH : '';
}

type RouterValue = {
	view: View;
	navigate: (next: View) => void;
};

const RouterContext = createContext<RouterValue>({ view: 'wizard', navigate: () => {} });

export function RouterProvider({ children }: { children: ComponentChildren }) {
	// 首屏直接读 hash：带 `#outro` 打开或刷新时就落在最终页。
	const [view, setView] = useState<View>(readView);

	// 前进 / 后退 / 手改地址栏都靠它同步回来。
	useEffect(() => {
		const sync = () => setView(readView());
		window.addEventListener('hashchange', sync);
		return () => window.removeEventListener('hashchange', sync);
	}, []);

	const navigate = useCallback((next: View) => {
		setView(next); // 先切视图，不等 hashchange 事件，避免闪一下
		writeView(next);
		window.scrollTo(0, 0);
	}, []);

	const value = useMemo(() => ({ view, navigate }), [view, navigate]);

	return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
	return useContext(RouterContext);
}
