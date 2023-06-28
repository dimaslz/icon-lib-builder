import ParserByFramework from '@/entity-type/ParserByFramework.type';

const FRAMEWORK_PARSER: ParserByFramework = {
	preact: 'babel',
	react: 'babel',
	svg: 'babel',
	vue2: 'vue',
	vue3: 'vue',
	svelte: 'babel',
	angular: 'babel',
};

export default FRAMEWORK_PARSER;
