import { createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';

/**
 * 视图状态：应用有四个页面——首页（选开始方式）、表单（自己填）、问卷（照题答）、结尾页。
 *
 * 用 hash 记录当前视图，名字集中写在 HASHES 里：空 fragment 是首页，`#form` 是表单，
 * `#survey/<id>` 是某一份问卷（唯一带参数的一页），`#outro` 是结尾页，
 * 认不出的（包括手写的旧链接）一律回首页。
 * 用 hash 而不是路径，是因为改 hash 不触发导航，构建产物直接用浏览器打开（file://）时
 * 照样能用、能刷新、能前进后退；路径路由在 file:// 下会直接失败。
 */
export type View = 'home' | 'form' | 'survey' | 'outro';

const HASHES: Record<View, string> = { home: '', form: 'form', survey: 'survey', outro: 'outro' };

interface Route {
	view: View;
	/** 只有问卷用得上：`#survey/<id>` 里的 id */
	id: string | null;
}

function readRoute(): Route {
	const [name = '', id = ''] = window.location.hash.slice(1).trim().toLowerCase().split('/');
	const view = (Object.keys(HASHES) as View[]).find((key) => HASHES[key] === name) ?? 'home';
	return { view, id: id || null };
}

function writeRoute(route: Route) {
	// 回首页时赋空字符串，只会留下一个「空的 fragment」，地址栏里就是那个 `#`。
	// 用 replaceState 自己拼路径能抹掉它，但要动 History API + 显式路径，file:// 下不值当，保留 `#`。
	const hash = route.view === 'survey' && route.id ? `${HASHES.survey}/${route.id}` : HASHES[route.view];
	window.location.hash = hash;
}

type RouterValue = {
	view: View;
	/** 当前问卷 id，只在 view === 'survey' 时有值 */
	surveyId: string | null;
	navigate: (next: View, id?: string) => void;
};

const RouterContext = createContext<RouterValue>({ view: 'home', surveyId: null, navigate: () => {} });

export function RouterProvider({ children }: { children: ComponentChildren }) {
	// 首屏直接读 hash：带着 `#form`、`#survey/<id>` 或 `#outro` 打开、刷新时就落在对应页面。
	const [route, setRoute] = useState<Route>(readRoute);

	// 前进 / 后退 / 手改地址栏都靠它同步回来。
	useEffect(() => {
		const sync = () => setRoute(readRoute());
		window.addEventListener('hashchange', sync);
		return () => window.removeEventListener('hashchange', sync);
	}, []);

	const navigate = useCallback((next: View, id?: string) => {
		const to: Route = { view: next, id: id ?? null };
		setRoute(to); // 先切视图，不等 hashchange 事件，避免闪一下
		writeRoute(to);
		window.scrollTo(0, 0);
	}, []);

	const value = useMemo(
		() => ({ view: route.view, surveyId: route.id, navigate }),
		[route.view, route.id, navigate],
	);

	return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
	return useContext(RouterContext);
}
