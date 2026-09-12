import { createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';

// 地址就是一个名字：名字认得出哪一页由页面表说了算，路由自己不认识任何一页
const read_name = () => window.location.hash.slice(1).trim().toLowerCase();

// 换一页就回到顶部：地址是自己改的还是链接、前进后退改的，都归这儿管
const to_top = () => window.scrollTo(0, 0);

export type Navigate = (name: string | null) => void;

type RouterValue = {
	name: string;
	// 给一个名字就去那一页；给 null 是离开页面，地址清空、落回主页
	navigate: Navigate;
};

const ROUTER_CONTEXT = createContext<RouterValue>({ name: '', navigate: () => {} });

export function RouterProvider({ children }: { children: ComponentChildren }) {
	// 地址本身就是状态：首屏从地址读一次，带地址打开或刷新都落在同一页
	const [name, set_name] = useState(read_name);

	// 之后由地址的变化同步回来——前进 / 后退、手改地址都算
	useEffect(() => {
		const sync = () => {
			set_name(read_name());
			to_top();
		};
		window.addEventListener('hashchange', sync);
		return () => window.removeEventListener('hashchange', sync);
	}, []);

	const navigate = useCallback((next: string | null) => {
		set_name(next ?? ''); // 视图先行，不等事件绕回来，免得闪一下
		window.location.hash = next ?? '';
		to_top();
	}, []);

	const value = useMemo(() => ({ name, navigate }), [name, navigate]);

	return <ROUTER_CONTEXT.Provider value={value}>{children}</ROUTER_CONTEXT.Provider>;
}

export function use_router() {
	return useContext(ROUTER_CONTEXT);
}
