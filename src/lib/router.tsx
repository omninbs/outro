import { createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';

// 地址就是一个名字：名字认得出哪一页由页面表说了算，路由自己不认识任何一页
function readName() {
	return window.location.hash.slice(1).trim().toLowerCase();
}

// 换一页就回到顶部：地址是自己改的还是链接、前进后退改的，都归这儿管
const toTop = () => window.scrollTo(0, 0);

type RouterValue = {
	name: string;
	// 给一个名字就去那一页；给 null 是离开页面，地址清空、落回主页
	navigate: (name: string | null) => void;
};

const RouterContext = createContext<RouterValue>({ name: '', navigate: () => {} });

export function RouterProvider({ children }: { children: ComponentChildren }) {
	// 地址本身就是状态：首屏从地址读一次，带地址打开或刷新都落在同一页
	const [name, setName] = useState(readName);

	// 之后由地址的变化同步回来——前进 / 后退、手改地址都算
	useEffect(() => {
		const sync = () => {
			setName(readName());
			toTop();
		};
		window.addEventListener('hashchange', sync);
		return () => window.removeEventListener('hashchange', sync);
	}, []);

	const navigate = useCallback((next: string | null) => {
		setName(next ?? ''); // 视图先行，不等事件绕回来，免得闪一下
		window.location.hash = next ?? '';
		toTop();
	}, []);

	const value = useMemo(() => ({ name, navigate }), [name, navigate]);

	return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
	return useContext(RouterContext);
}
