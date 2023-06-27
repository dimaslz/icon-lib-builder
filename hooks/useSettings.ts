import { useEffect, useRef, useState } from 'react';

import frameworks from '@/constants/frameworks.constants';
import { Settings } from '@/entity-type';
import Observable from '@/utils/observable.util';


const initialValue: Settings = {
	svgString: '',
	componentString: '',
	filesDropped: [],
	iconName: 'Icon',
	filesDroppedSteps: {
		framework: { label: 'Select the framework', here: true },
		language: { label: 'Select the language', here: false },
		download: { label: 'Download', here: false },
	},
	frameworkRenderType: {
		label: '',
		name: '',
		mode: 'javascript',
	},
	currentFramework: frameworks[0],
	editorMode: 'javascript',
	filesConfigToDownload: null,
};


const useSettings = () => {
	const [settings, updateSettings] = useState<Settings>(initialValue);
	const observable = useRef(Observable<Settings>(settings));

	let mounted = false;
	useEffect(() => {
		if (mounted) return;
		mounted = true;

		observable.current.subscribe((value: Settings) => {
			if (value === undefined || value === null) return;

			updateSettings({
				...value,
			});
		});
	}, []);

	return {
		settings,
		updateSettings: (newSettings: Partial<Settings>) => {
			observable.current.set({
				...settings,
				...newSettings,
			});
		},
	};
};

export default useSettings;
