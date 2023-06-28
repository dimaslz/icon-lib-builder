import FrameworkName from './FrameworkName.type';

type ExtensionMap = {
	[K in FrameworkName]: string | { [V: string]: string };
};

export default ExtensionMap;