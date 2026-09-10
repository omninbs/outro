import { render } from 'preact';

import { App } from './app';
import { RouterProvider } from './lib/router';
import './style.css';

render(
	<RouterProvider>
		<App />
	</RouterProvider>,
	document.getElementById('app')!,
);
