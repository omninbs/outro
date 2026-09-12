import { HomePage } from './components/HomePage';
import { PageShell } from './components/PageShell';
import { useRouter } from './lib/router';
import { useCard } from './lib/store';
import { findPage } from './pages/_registry';

// 名字对得上页面表里哪一页就渲染哪一页；一个都对不上就是主页
export function App() {
	const { name, navigate } = useRouter();
	const { data, patch, reset } = useCard();
	const page = findPage(name);

	if (!page) {
		return (
			<PageShell width="standard">
				<HomePage />
			</PageShell>
		);
	}

	return page.render({ data, patch, reset, navigate });
}
