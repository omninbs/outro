import { HomePage } from './components/HomePage';
import { PageShell } from './components/PageShell';
import { useRouter } from './lib/router';
import { useCard } from './lib/store';
import { PAGES } from './pages/_registry';

// App 就是路由：hash 是哪个名字就渲染哪一页，认不出（含空）就是主页
export function App() {
	const { name, navigate } = useRouter();
	const { data, patch, reset } = useCard();

	const page = PAGES.find((page) => page.name === name);
	if (!page) {
		return (
			<PageShell width="standard">
				<HomePage />
			</PageShell>
		);
	}

	return page.render({ data, patch, reset, navigate });
}
