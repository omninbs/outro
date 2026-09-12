import { render } from 'preact';

import { App } from './app';
import { RouterProvider } from './lib/router';
import { CardProvider } from './lib/store';
import './style.css';

render(
	<RouterProvider>
		<CardProvider>
			<App />
		</CardProvider>
	</RouterProvider>,
	document.getElementById('app')!,
);
