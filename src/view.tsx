import { render } from 'preact';

import { ColophonPage } from './components/ColophonPage';
import { loadCard } from './lib/store';
import './style.css';

render(
	<div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
		<ColophonPage data={loadCard()} exitHref="./" />
	</div>,
	document.getElementById('app')!,
);
