import { AngularIcon, PreactIcon, VueIcon } from '../components/icons';
import ReactIcon from '../components/icons/ReactIcon.component';
import Framework from '../entity-type/Framework.type';

export const frameworks: Framework[] = [
	{
		label: 'React',
		name: 'react',
		mode: 'javascript',
		icon: ReactIcon,
		types: [
			{ label: 'Javascript', name: 'js', mode: 'javascript' },
			{ label: 'TypeScript', name: 'ts', mode: 'typescript' },
		],
	},
	{
		label: 'Preact',
		name: 'preact',
		mode: 'javascript',
		icon: PreactIcon,
		types: [
			{ label: 'Javascript', name: 'js', mode: 'javascript' },
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
		label: 'Angular +2',
		icon: AngularIcon,
		name: 'angular',
		mode: 'typescript',
		types: [],
	},
];

export default frameworks;