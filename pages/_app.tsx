import 'tailwindcss/tailwind.css';
import '../assets/css/style.scss';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
export default MyApp;
