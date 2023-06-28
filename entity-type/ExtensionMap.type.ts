import FrameworkName from './FrameworkName.type';

type ExtensionMap = {
	// eslint-disable-next-line no-unused-vars
	[K in FrameworkName]: string | { [V: string]: string };
};

export default ExtensionMap;