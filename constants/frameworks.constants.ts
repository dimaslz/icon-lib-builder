import { AngularIcon, PreactIcon, VueIcon } from '../components/icons';
import ReactIcon from '../components/icons/ReactIcon.component';
import Framework from '../entity-type/Framework.type';

export const frameworks: Framework[] = [
	{
		label: 'React',
		name: 'react',
		mode: 'javascript',
		icon: ReactIcon,
		preview: true,
		types: [
			{ label: 'Javascript', name: 'js', mode: 'javascript', preview: true },
			{ label: 'TypeScript', name: 'ts', mode: 'typescript', preview: true },
		],
	},
	{
		label: 'Preact',
		name: 'preact',
		mode: 'javascript',
		icon: PreactIcon,
		preview: true,
		types: [
			{ label: 'Javascript', name: 'js', mode: 'javascript', preview: true },
			{ label: 'TypeScript', name: 'ts', mode: 'typescript', preview: true },
		],
	},
	{
		label: 'Vue 2',
		name: 'vue2',
		mode: 'javascript',
		icon: VueIcon,
		preview: true,
		types: [
			{ label: 'Javascript', name: 'js', mode: 'javascript', preview: true },
			{ label: 'TypeScript', name: 'ts', mode: 'typescript', preview: true },
		],
	},
	{
		label: 'Vue 3',
		name: 'vue3',
		mode: 'javascript',
		icon: VueIcon,
		preview: true,
		types: [
			{ label: 'Javascript', name: 'js', mode: 'javascript', preview: true },
			{ label: 'TypeScript', name: 'ts', mode: 'typescript', preview: true },
			{ label: 'TS Compressed', name: 'compressed', mode: 'typescript', preview: true },
		],
	},
	{
		label: 'Angular +2',
		icon: AngularIcon,
		name: 'angular',
		mode: 'typescript',
		preview: true,
		types: [],
	},
];

export default frameworks;