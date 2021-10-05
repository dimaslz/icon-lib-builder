import 'tailwindcss/tailwind.css';
import '../assets/css/style.scss';

import type { AppProps } from 'next/app';
import { useLayoutEffect } from 'react';

const { NODE_ENV } = process.env;

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
	useLayoutEffect(() => {
		if (NODE_ENV === 'production') {
			const node: HTMLScriptElement = document.createElement('script');
			node.src = 'https://plausible.io/js/plausible.js';
			node.type = 'text/javascript';
			node.async = true;
			node.defer = true;
			node.dataset.domain = 'icon-lib-builder.dimaslz.dev';

			document.getElementsByTagName('head')[0].appendChild(node);
		}
	});

	return <Component {...pageProps} />;
};
export default MyApp;
