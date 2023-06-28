import FrameworkName from './FrameworkName.type';

type ParserByFramework = {
	// eslint-disable-next-line no-unused-vars
	[K in FrameworkName | 'svg']: 'babel' | 'vue';
};

export default ParserByFramework;