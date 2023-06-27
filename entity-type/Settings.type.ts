import FilesDroppedSteps from './FilesDroppedSteps.type';
import Framework from './Framework.type';
import FrameworkRenderType from './FrameworkRenderType.type';
import Language from './Language.type';

type Settings = {
	svgString: string;
	componentString: string;
	filesDropped: File[];
	iconName: string;
	filesDroppedSteps: FilesDroppedSteps;
	frameworkRenderType: FrameworkRenderType;
	currentFramework: Framework
	editorMode: Language;
	filesConfigToDownload: {
		framework: Framework,
		language: Language;
	} | null;
};

export default Settings;