import { ChangeEvent } from 'react';

import { CrossIcon, JSIcon, TSIcon } from '@/components/icons';
import { DynamicCodeEditor } from '@/components';
import { FileToUpload, Framework, Language } from '@/entity-type';
import Api from '@/api';
import { readFile, autoDownload, copyToClipboard } from '@/utils';
import eventBus from '@/utils/event-bus.utils';
import frameworks from '@/constants/frameworks.constants';
import { useSettings } from '@/hooks';


type Props = {
	onLoad: () => void;
}

const ComponentEditorView = ({
	onLoad,
}: Props) => {
	const { settings, updateSettings } = useSettings();

	const onDownloadIcons = () => {
		updateSettings({
			filesDropped: [],
		});
	};

	const onClickLanguageOption = (language: Language) => {
		if (!settings.filesConfigToDownload) return;

		updateSettings({
			filesDroppedSteps: {
				framework: { ...settings.filesDroppedSteps.framework, here: false },
				language: { ...settings.filesDroppedSteps.language, here: false },
				download: { ...settings.filesDroppedSteps.download, here: true },
			},
			filesConfigToDownload: {
				...settings.filesConfigToDownload,
				language,
			},
		});

		// downloadIcons();
	};

	const onCancelIconsDropped = () => {
		updateSettings({
			filesDropped: [],
			filesDroppedSteps: {
				framework: { ...settings.filesDroppedSteps.framework, here: true },
				language: { ...settings.filesDroppedSteps.language, here: false },
				download: { ...settings.filesDroppedSteps.download, here: false },
			},
			filesConfigToDownload: null,
		});
	};

	const onClickFrameworkOption = (framework: Framework) => {
		updateSettings({
			filesDroppedSteps: {
				...settings.filesDroppedSteps,
				framework: { ...settings.filesDroppedSteps.framework, here: false },
				language: { ...settings.filesDroppedSteps.language, here: true },
			},
			filesConfigToDownload: {
				framework,
				language: 'javascript',
			},
		});
	};

	async function downloadIcons() {
		if (!settings.filesConfigToDownload?.framework) return;

		const language = ((settings.filesConfigToDownload.framework.types || [])
			.find((framework) => framework.mode === settings.filesConfigToDownload?.language) || {}).name;

		if (!language) return;

		const framework = settings.filesConfigToDownload.framework.name;

		const filesContent: FileToUpload[] = (
			await Promise.all(
				settings.filesDropped.map(async (file: File) => {
					const value = await readFile(file);
					return {
						name: file.name,
						svg: value,
					};
				}),
			)
		).filter((i) => i);

		if (filesContent.length) {
			try {
				const filesUploaded: any = await Api.uploadFiles(
					filesContent,
					framework,
					language,
				);

				downloadFile(filesUploaded?.file);
			} catch (err) {
				console.error('Err: ', err);
			}
		}

		onDownloadIcons();
		updateSettings({
			filesConfigToDownload: null,
			filesDroppedSteps: {
				...settings.filesDroppedSteps,
				framework: { ...settings.filesDroppedSteps.framework, here: true },
				language: { ...settings.filesDroppedSteps.language, here: false },
				download: { ...settings.filesDroppedSteps.download, here: false },
			},
		});
	}

	async function downloadFile(filename: string) {
		try {
			const blob = await Api.downloadFilename(filename);

			autoDownload(blob, filename);
		} catch (err) {
			eventBus.publish('notification', {
				message: 'Problem uploading files',
			});
		}
	}

	const onFrameworkChange = async (framework: Framework, type?: any) => {
		const noTypes = !framework.types?.length;

		const defaultType = (framework.types || [])[0];

		let script = '';
		if (noTypes) {
			script = await Api.formatter({
				script: settings.svgString,
				framework: framework.name,
				iconName: settings.iconName,
			});

		} else {
			script = await Api.formatter({
				script: settings.svgString,
				framework: framework.name,
				iconName: settings.iconName,
				type: type?.name || defaultType.name,
			});
		}

		updateSettings({
			componentString: script,
			currentFramework: framework,
			frameworkRenderType: type || defaultType,
			editorMode: type?.mode || framework.mode,
		});
	};

	const onChangeIconName = async (
		$event: ChangeEvent<HTMLInputElement>,
	) => {
		if (($event.nativeEvent as InputEvent).data === ' ') return;

		const value = $event.target.value.replace(/[\W\s]+/gi, '');

		updateSettings({
			iconName: value,
		});
	};

	const onClickCopyResult = () => {
		copyToClipboard(settings.componentString);
	};

	return (
		<div
			className={[
				'Result w-full pl-4 h-full flex flex-col',
				!settings.componentString && !settings.filesDropped.length
					? 'pointer-events-none opacity-50'
					: '',
			].join(' ')}
			suppressHydrationWarning
		>
			{settings.filesDropped.length ? (
				<div className="relative w-full h-full">
					<button className="absolute top-4 right-4 bg-[#414853] p-2 rounded-full hover:bg-[#272d35]" onClick={() => onCancelIconsDropped()}>
						<CrossIcon className="text-white" />
					</button>
					<div
						style={{ backgroundColor: '#3C4451' }}
						className={[
							'text-gray-200 h-full p-4 text-sm font-normal',
							settings.filesDropped.length
								? 'flex flex-col items-center justify-center'
								: '',
						].join(' ')}
					>
						{settings.filesDroppedSteps.framework.here && <div>
							<h2 className="text-6xl">{ settings.filesDroppedSteps.framework.label }</h2>
							<ul className="flex flex-col">
								{frameworks.map((framework, key) => (
									<li key={key}>
										<button
											className={[
												'mx-1 p-4 rounded-full hover:bg-gray-500 cursor-pointer my-2 bg-gray-700 text-center w-full',
											].join(' ')}
											onClick={() => onClickFrameworkOption(framework)}
										>
											{framework.label.toUpperCase()}
										</button>
									</li>
								))}
							</ul>
						</div>}
						{settings.filesDroppedSteps.language.here && <div>
							<h2 className="text-6xl">{settings.filesDroppedSteps.language.label}</h2>
							<ul className="flex flex-col">
								<li>
									<button
										className={[
											'mx-1 p-4 rounded-full hover:bg-gray-500 cursor-pointer my-2 bg-gray-700 text-center w-full',
										].join(' ')}
										onClick={() => onClickLanguageOption('javascript')}
									>javascript</button>
								</li>
								<li>
									<button
										className={[
											'mx-1 p-4 rounded-full hover:bg-gray-500 cursor-pointer my-2 bg-gray-700 text-center w-full',
										].join(' ')}
										onClick={() => onClickLanguageOption('typescript')}
									>typescript</button>
								</li>
							</ul>
						</div>}
						{settings.filesDroppedSteps.download.here && <div>
							<h2 className="text-6xl">{settings.filesDroppedSteps.download.label}</h2>
							<button
								className={[
									'mx-1 p-4 rounded-full hover:bg-gray-500 cursor-pointer my-2 bg-gray-700 text-center w-full',
								].join(' ')}
								onClick={() => downloadIcons()}
							>download</button>
						</div>}
					</div>
				</div>
			) : (
				<div className="flex flex-col h-full">
					{settings.componentString && (
						<button
							onClick={onClickCopyResult}
							className={[
								'px-3 py-2 rounded-sm absolute right-10 top-24 z-10 bg-gray-900 text-white hover:opacity-70 focus:outline-none',
								settings.currentFramework?.types?.length ? 'mt-8' : '',
							].join(' ')}
						>
							copy
						</button>
					)}

					<div className="Result__format">
						<ul className="text-xs text-white flex bg-gray-700 p-2">
							{frameworks.map((framework, key) => (
								<li key={key}>
									<button
										className={[
											'mx-1 p-2 rounded-md hover:bg-gray-500 cursor-pointer flex items-center',
											framework.name === settings.currentFramework.name
												? 'bg-gray-400'
												: 'bg-gray-700',
										].join(' ')}
										onClick={() => onFrameworkChange(framework)}
									>
										{framework.icon && <framework.icon size="16" />}<span className="ml-1">{framework.label}</span>
									</button>
								</li>
							))}
						</ul>
					</div>
					<div className="IconName">
						<input
							type="text"
							className="w-full bg-gray-400 m-1 p-1 text-sm"
							value={settings.iconName}
							onChange={onChangeIconName}
						/>
					</div>

					<div className="pb-1 flex">
						{settings.currentFramework?.types?.map(
							(type, key) => (
								<button
									className={[
										'text-xs text-white mx-1 p-2 rounded-md hover:bg-gray-500 cursor-pointer flex items-center',
										type.name === settings.frameworkRenderType.name
											? 'bg-gray-400'
											: 'bg-gray-700',
									].join(' ')}
									key={`${key}f.label`}
									onClick={() => onFrameworkChange(settings.currentFramework, type)}
								>
									{['ts', 'compressed'].includes(type.name) &&
										<span><TSIcon className="text-blue-500" /></span>
									}
									{type.name.includes('js') &&
										<span><JSIcon className="text-yellow-500" /></span>
									}
									<span className="ml-2">{type.label}</span>
								</button>
							),
						)}
					</div>

					<div className="h-full">
						<DynamicCodeEditor
							placeholder="Here you will have your code formated in the framework as you want"
							name="result"
							value={settings.componentString}
							readOnly
							mode={settings.editorMode}
							onLoad={onLoad}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default ComponentEditorView;