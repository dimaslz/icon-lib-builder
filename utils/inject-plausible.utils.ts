const injectPlausible = () => {
	const node: HTMLScriptElement = document.createElement('script');
	node.src = 'https://plausible.io/js/plausible.js';
	node.type = 'text/javascript';
	node.async = true;
	node.defer = true;
	node.dataset.domain = 'svg-icon-2-fw-component.dimaslz.dev';

	document.getElementsByTagName('head')[0].appendChild(node);
};

export default injectPlausible;