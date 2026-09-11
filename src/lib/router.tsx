import { createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';

/**
 * 视图状态：应用就四页——首页、表单、问卷、结尾页。
 *
 * 用 hash 而不是路径，是因为产物要被当文件直接打开：那样照样能刷新、能前进后退，
 * 路径路由在这里直接废掉。代价是入口名跟固定页的地址共用一个命名空间，不能撞名。
 */
export type View = 'home' | 'form' | 'survey' | 'outro';

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
	// 回首页会在地址栏留下一个空 fragment；抹掉它得自己动 History API，不值当，留着
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
	// 地址本身就是状态：首屏从地址读一次，带着地址打开或刷新都落在同一页
	const [route, setRoute] = useState<Route>(readRoute);

	// 之后由地址的变化同步回来——前进 / 后退、手改地址都算
	useEffect(() => {
		const sync = () => setRoute(readRoute());
		window.addEventListener('hashchange', sync);
		return () => window.removeEventListener('hashchange', sync);
	}, []);

	const navigate = useCallback((next: View, id?: string) => {
		const to: Route = { view: next, id: id ?? null };
		setRoute(to); // 视图先行，不等事件绕回来，免得闪一下
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
