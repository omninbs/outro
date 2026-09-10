import { createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';

/**
 * 视图状态：应用有四个页面——首页（选开始方式）、表单（自己填）、问卷（照题答）、结尾页。
 *
 * 用 hash 记录当前视图：空 fragment 是首页，`#form` 是表单，`#outro` 是结尾页，
 * 其余的 hash 就是某份问卷的 id——`#blank`、`#demo`，问卷在地址里就是它自己的名字，
 * 不再套 `survey/` 那一层。认不出的名字也当问卷 id，由问卷页告诉用户没有这一份。
 * 代价是问卷 id 不能占用保留名 `form` / `outro`。
 *
 * 用 hash 而不是路径，是因为改 hash 不触发导航，构建产物直接用浏览器打开（file://）时
 * 照样能用、能刷新、能前进后退；路径路由在 file:// 下会直接失败。
 */
export type View = 'home' | 'form' | 'survey' | 'outro';

/** 保留名：这几页占掉的 hash，问卷 id 不能重名。问卷没有固定 hash，用它的 id 当 hash */
const RESERVED = { form: 'form', outro: 'outro' } as const;

interface Route {
	view: View;
	/** 只有问卷用得上：就是 hash 本身 */
	id: string | null;
}

function readRoute(): Route {
	const name = window.location.hash.slice(1).trim().toLowerCase();

	if (name === RESERVED.form) return { view: 'form', id: null };
	if (name === RESERVED.outro) return { view: 'outro', id: null };
	if (!name) return { view: 'home', id: null };

	return { view: 'survey', id: name };
}

function writeRoute(route: Route) {
	// 回首页时赋空字符串，只会留下一个「空的 fragment」，地址栏里就是那个 `#`。
	// 用 replaceState 自己拼路径能抹掉它，但要动 History API + 显式路径，file:// 下不值当，保留 `#`。
	if (route.view === 'survey') {
		window.location.hash = route.id ?? '';
		return;
	}

	window.location.hash = route.view === 'home' ? '' : RESERVED[route.view];
}

type RouterValue = {
	view: View;
	/** 当前问卷 id，只在 view === 'survey' 时有值 */
	surveyId: string | null;
	navigate: (next: View, id?: string) => void;
};

const RouterContext = createContext<RouterValue>({ view: 'home', surveyId: null, navigate: () => {} });

export function RouterProvider({ children }: { children: ComponentChildren }) {
	// 首屏直接读 hash：带着 `#form`、`#demo` 或 `#outro` 打开、刷新时就落在对应页面。
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
