import { createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';

/**
 * 视图状态：应用有三个页面——首页（选开始方式）、表单（空预设，全自己填）、结尾页。
 *
 * 用 hash 记录当前视图，名字集中写在 HASHES 里：空 fragment 是首页，`#form` 是空预设表单，
 * `#outro` 是结尾页，认不出的（包括手写的旧链接）一律回首页。
 * 用 hash 而不是路径，是因为改 hash 不触发导航，构建产物直接用浏览器打开（file://）时
 * 照样能用、能刷新、能前进后退；路径路由在 file:// 下会直接失败。
 */
export type View = 'home' | 'form' | 'outro';

const HASHES: Record<View, string> = { home: '', form: 'form', outro: 'outro' };

function readView(): View {
	const name = window.location.hash.slice(1).trim().toLowerCase();
	return (Object.keys(HASHES) as View[]).find((view) => HASHES[view] === name) ?? 'home';
}

function writeView(view: View) {
	// 回首页时赋空字符串，只会留下一个「空的 fragment」，地址栏里就是那个 `#`。
	// 用 replaceState 自己拼路径能抹掉它，但要动 History API + 显式路径，file:// 下不值当，保留 `#`。
	window.location.hash = HASHES[view];
}

type RouterValue = {
	view: View;
	navigate: (next: View) => void;
};

const RouterContext = createContext<RouterValue>({ view: 'home', navigate: () => {} });

export function RouterProvider({ children }: { children: ComponentChildren }) {
	// 首屏直接读 hash：带着 `#form` 或 `#outro` 打开、刷新时就落在对应页面。
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
