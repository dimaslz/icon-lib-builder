import Framework from '../entity-type/Framework.type';

export const frameworks: Framework[] = [
	{
		label: 'React',
		name: 'react',
		mode: 'javascript',
		types: [],
	},
	{
		label: 'Preact',
		name: 'preact',
		mode: 'javascript',
		types: [],
	},
	{
		label: 'Vue 2',
		name: 'vue2',
		mode: 'javascript',
		types: [
			{ label: 'Javascript', name: 'js', mode: 'javascript' },
			{ label: 'TypeScript', name: 'ts', mode: 'typescript' },
		],
	},
	{
		label: 'Vue 3',
		name: 'vue3',
		mode: 'javascript',
		types: [
			{ label: 'Javascript', name: 'js', mode: 'javascript' },
			{ label: 'TypeScript', name: 'ts', mode: 'typescript' },
			{ label: 'TS Compressed', name: 'compressed', mode: 'typescript' },
		],
	},
	{
		label: 'Angular +2',
		name: 'angular',
		mode: 'typescript',
		types: [],
	},
];

export default frameworks;