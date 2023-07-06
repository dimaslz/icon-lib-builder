import type Settings from '@/entity-type/Settings.type';

import FRAMEWORK_CONFIG from './framework-config.constants';

const INITIAL_SETTINGS: Settings = {
	iconName: 'Icon',
	framework: FRAMEWORK_CONFIG[0],
	render: {
		label: 'Javascript v1',
		name: 'js-v1',
		mode: 'javascript',
	},
	filesDroppedSteps: {
		framework: { label: 'Select the framework', here: true },
		language: { label: 'Select the language', here: false },
		download: { label: 'Download', here: false },
	},
	editorMode: 'javascript',
	configToDownload: null,
};

export default INITIAL_SETTINGS;
