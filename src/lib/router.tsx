import { createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';

import { STEPS, findStep, stepRoute } from '../steps/_registry';
import { findSurvey } from '../surveys/_registry';

// 视图状态：命中 outro 是预览页，命中步骤是向导那一步，命中问卷是问卷页，其余统统落主页。
export type View = 'home' | 'edit' | 'survey' | 'outro';

interface Route {
	view: View;
	// 这一页在地址里的名字：向导是步骤地址，问卷是问卷 id
	id: string | null;
}

function readRoute(): Route {
	const name = window.location.hash.slice(1).trim().toLowerCase();

	if (name === 'outro') return { view: 'outro', id: null };

	// 向导是一组页面：每一步一个地址，地址就是它在步骤表里的名字
	if (findStep(name) >= 0) return { view: 'edit', id: name };

	// 剩下的名字里，认得出的才是问卷
	const survey = findSurvey(name);
	if (survey) return { view: 'survey', id: survey.id };

	// 空 hash 与认不出的名字一样：主页是纯 fallback
	return { view: 'home', id: null };
}

// 换一页就回到顶部：地址是自己改的还是链接、前进后退改的，都归这儿管
const toTop = () => window.scrollTo(0, 0);

function writeRoute(route: Route) {
	if (route.view === 'outro') {
		window.location.hash = 'outro';
		return;
	}

	if (route.view === 'edit' || route.view === 'survey') {
		window.location.hash = route.id ?? stepRoute(STEPS[0].id);
		return;
	}

	// 主页没有自己的地址，写回空值；空值同样走 fallback
	window.location.hash = '';
}

type RouterValue = {
	view: View;
	// 当前页面在地址里的名字，只有向导与问卷页用得上
	routeId: string | null;
	navigate: (next: View, id?: string) => void;
};

const RouterContext = createContext<RouterValue>({ view: 'home', routeId: null, navigate: () => {} });

export function RouterProvider({ children }: { children: ComponentChildren }) {
	// 地址本身就是状态：首屏从地址读一次，刷新也落在同一页
	const [route, setRoute] = useState<Route>(readRoute);

	// 之后由地址的变化同步回来——前进 / 后退、手改地址都算
	useEffect(() => {
		const sync = () => {
			setRoute(readRoute());
			toTop();
		};
		window.addEventListener('hashchange', sync);
		return () => window.removeEventListener('hashchange', sync);
	}, []);

	const navigate = useCallback((next: View, id?: string) => {
		const to: Route = { view: next, id: id ?? null };
		setRoute(to); // 视图先行，不等事件绕回来，免得闪一下
		writeRoute(to);
		toTop();
	}, []);

	const value = useMemo(
		() => ({ view: route.view, routeId: route.id, navigate }),
		[route.view, route.id, navigate],
	);

	return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
	return useContext(RouterContext);
}
