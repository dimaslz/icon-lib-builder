import { AngularIcon, PreactIcon, ReactIcon, SvelteIcon, VueIcon } from '@/components/icons';
import { Framework } from '@/entity-type';

const FRAMEWORK_CONFIG: Framework[] = [
	{
		label: 'React',
		name: 'react',
		mode: 'javascript',
		icon: ReactIcon,
		types: [
			{ label: 'Javascript v1', name: 'js-v1', mode: 'javascript' },
			{ label: 'Javascript v2', name: 'js-v2', mode: 'javascript' },
			{ label: 'TypeScript', name: 'ts', mode: 'typescript' },
		],
	},
	{
		label: 'Preact',
		name: 'preact',
		mode: 'javascript',
		icon: PreactIcon,
		types: [
			{ label: 'Javascript v1', name: 'js-v1', mode: 'javascript' },
			{ label: 'Javascript v2', name: 'js-v2', mode: 'javascript' },
			{ label: 'TypeScript', name: 'ts', mode: 'typescript' },
		],
	},
	{
		label: 'Vue 2',
		name: 'vue2',
		mode: 'javascript',
		icon: VueIcon,
		types: [
			{ label: 'Javascript', name: 'js', mode: 'javascript' },
			{ label: 'TypeScript', name: 'ts', mode: 'typescript' },
		],
	},
	{
		label: 'Vue 3',
		name: 'vue3',
		mode: 'javascript',
		icon: VueIcon,
		types: [
			{ label: 'Javascript', name: 'js', mode: 'javascript' },
			{ label: 'TypeScript', name: 'ts', mode: 'typescript' },
			{ label: 'TS Compressed', name: 'compressed', mode: 'typescript' },
		],
	},
	{
		label: 'Svelte',
		name: 'svelte',
		mode: 'javascript',
		icon: SvelteIcon,
		types: [
			{ label: 'Javascript', name: 'js', mode: 'javascript' },
			{ label: 'Typescript', name: 'ts', mode: 'typescript' },
		],
	},
	{
		label: 'Angular',
		icon: AngularIcon,
		name: 'angular',
		mode: 'typescript',
		types: [],
	},
];

export default FRAMEWORK_CONFIG;