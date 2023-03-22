import 'tailwindcss/tailwind.css';
import '../assets/css/style.scss';

// components
import '../components/fork-me-on-github.component.scss';

import type { AppProps } from 'next/app';
import { useEffect } from 'react';

const injectPlausible = () => {
	const node: HTMLScriptElement = document.createElement('script');
	node.src = 'https://plausible.io/js/plausible.js';
	node.type = 'text/javascript';
	node.async = true;
	node.defer = true;
	node.dataset.domain = 'svg-icon-2-fw-component.dimaslz.dev';

	document.getElementsByTagName('head')[0].appendChild(node);
};

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
	let ignore = false;
	useEffect(() => {
		if (!ignore) injectPlausible();

		return () => { ignore = true; };
	}, []);
	return <Component {...pageProps} />;
};
export default MyApp;
