import { createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';

import { findSurvey } from '../surveys/_registry';
import type { Survey } from './survey/types';

/**
 * 视图状态：命中 `outro` 是预览页；命中 `form` 这一组——表单本身，以及各份问卷——
 * 是填写用的页面；都命中不到就落首页。
 *
 * 用 hash 而不是路径，是因为产物要被当文件直接打开：那样照样能刷新、能前进后退，
 * 路径路由在这里直接废掉。
 */
export type View = 'home' | 'form' | 'outro';

/** 表单本身的地址名：`form` 是一组页面的入口，没有问题要问的问卷也落在这儿 */
const FORM = 'form';

/**
 * 一份问卷在地址上算哪一页：一道题都没有的那份（「编辑表单」）进去就是表单本身，
 * 不另占地址，所以给 `null`。
 */
const formPageOf = (survey: Survey) => (survey.questions.length ? survey.id : null);

/** 一份问卷打开哪一页：首页卡片从这里取地址 */
export function surveyHref(survey: Survey) {
	const id = formPageOf(survey);
	return id === null ? `#${FORM}` : `#${id}`;
}

interface Route {
	view: View;
	/** 只有 form 组里的问卷用得上：就是 hash 本身 */
	id: string | null;
}

function readRoute(): Route {
	const name = window.location.hash.slice(1).trim().toLowerCase();

	if (name === 'outro') return { view: 'outro', id: null };
	// form 是一组页面：表单本身没有 id，各份问卷的 id 就是它在地址里的名字
	if (name === FORM) return { view: 'form', id: null };

	const survey = name ? findSurvey(name) : undefined;
	if (!survey) return { view: 'home', id: null };

	return { view: 'form', id: formPageOf(survey) };
}

/** 换一页就回到顶部：地址是自己改的（`navigate`）还是链接、前进后退改的，都归这儿管 */
const toTop = () => window.scrollTo(0, 0);

function writeRoute(route: Route) {
	if (route.view === 'outro') {
		window.location.hash = 'outro';
		return;
	}

	if (route.view === 'form') {
		window.location.hash = route.id ?? FORM;
		return;
	}

	// 回首页会在地址栏留下一个空 fragment；抹掉它得自己动 History API，不值当，留着
	window.location.hash = '';
}

type RouterValue = {
	view: View;
	/** 当前问卷 id，只在 form 组里的问卷页有值 */
	surveyId: string | null;
	navigate: (next: View, id?: string) => void;
};

const RouterContext = createContext<RouterValue>({ view: 'home', surveyId: null, navigate: () => {} });

export function RouterProvider({ children }: { children: ComponentChildren }) {
	// 地址本身就是状态：首屏从地址读一次，带着地址打开或刷新都落在同一页
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
		() => ({ view: route.view, surveyId: route.id, navigate }),
		[route.view, route.id, navigate],
	);

	return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
	return useContext(RouterContext);
}
