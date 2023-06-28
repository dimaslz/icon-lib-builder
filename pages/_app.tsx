import 'tailwindcss/tailwind.css';
import '@/assets/css/style.scss';

import type { AppProps } from 'next/app';
import { useEffect } from 'react';

import { injectPlausible } from '@/utils';


const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
	let mounted = false;
	useEffect(() => {
		if (!mounted) injectPlausible();

		return () => { mounted = true; };
	}, []);

	return <Component {...pageProps} />;
};

export default MyApp;
