import { createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';

import { STEPS, findStep, stepRoute } from '../steps/_registry';
import { findSurvey } from '../surveys/_registry';
import type { Survey } from './survey/types';

// 写在地址里的页面：向导某一步、某份问卷、预览页；认不出地址就没有页面，主页是它的落点
export type Page =
	| { kind: 'wizard'; step: number }
	| { kind: 'survey'; survey: Survey }
	| { kind: 'outro' };

// 地址认得出的页面；认不出返回 null——主页不是一个地址，只是这个 null 的落点
function readPage(): Page | null {
	const name = window.location.hash.slice(1).trim().toLowerCase();

	if (name === 'outro') return { kind: 'outro' };

	// 向导是一组页面：每一步一个地址，地址就是它在步骤表里的名字
	const step = findStep(name);
	if (step >= 0) return { kind: 'wizard', step };

	// 剩下的名字里，认得出的才是问卷
	const survey = findSurvey(name);
	if (survey) return { kind: 'survey', survey };

	return null;
}

// 换一页就回到顶部：地址是自己改的还是链接、前进后退改的，都归这儿管
const toTop = () => window.scrollTo(0, 0);

// null 表示没有页面：把地址清空，主页就是它落的地方
function writePage(page: Page | null) {
	if (!page) {
		window.location.hash = '';
		return;
	}

	if (page.kind === 'outro') {
		window.location.hash = 'outro';
		return;
	}

	if (page.kind === 'wizard') {
		window.location.hash = stepRoute(STEPS[page.step].id);
		return;
	}

	window.location.hash = page.survey.id;
}

type RouterValue = {
	page: Page | null;
	navigate: (page: Page | null) => void;
};

const RouterContext = createContext<RouterValue>({ page: null, navigate: () => {} });

export function RouterProvider({ children }: { children: ComponentChildren }) {
	// 地址本身就是状态：首屏从地址读一次，带地址打开或刷新都落在同一页
	const [page, setPage] = useState<Page | null>(readPage);

	// 之后由地址的变化同步回来——前进 / 后退、手改地址都算
	useEffect(() => {
		const sync = () => {
			setPage(readPage());
			toTop();
		};
		window.addEventListener('hashchange', sync);
		return () => window.removeEventListener('hashchange', sync);
	}, []);

	const navigate = useCallback((next: Page | null) => {
		setPage(next); // 视图先行，不等事件绕回来，免得闪一下
		writePage(next);
		toTop();
	}, []);

	const value = useMemo(() => ({ page, navigate }), [page, navigate]);

	return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
	return useContext(RouterContext);
}
