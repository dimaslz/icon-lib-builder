import type ExtensionMap from '@/entity-type/ExtensionMap.type';

const EXTENSION_MAP: ExtensionMap = {
	preact: { 'js-v1': '.jsx', 'js-v2': '.jsx', ts: '.tsx' },
	react: { 'js-v1': '.jsx', 'js-v2': '.jsx', ts: '.tsx' },
	vue2: '.vue',
	vue3: '.vue',
	svelte: '.svelte',
	angular: '.ts',
};

export default EXTENSION_MAP;