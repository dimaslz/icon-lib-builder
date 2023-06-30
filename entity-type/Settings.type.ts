import FilesDroppedSteps from './FilesDroppedSteps.type';
import Framework from './Framework.type';
import FrameworkRenderType from './FrameworkRenderType.type';
import Language from './Language.type';

type Settings = {
	iconName: string;
	filesDroppedSteps: FilesDroppedSteps;
	framework: Framework
	editorMode: Language;
	render: FrameworkRenderType;
	configToDownload: {
		framework: Framework,
		language: Language;
	} | null;
};

export default Settings;