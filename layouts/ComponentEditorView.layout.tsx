import debounce from 'lodash/debounce';
import { ChangeEvent, useMemo, useState } from 'react';

import Api from '@/api';
import { DynamicCodeEditor } from '@/components';
import { CrossIcon, JSIcon, TSIcon } from '@/components/icons';
import { FRAMEWORK_CONFIG } from '@/constants';
import { FileToUpload, Framework, FrameworkRenderType, Language, Settings } from '@/entity-type';
import { autoDownload, copyToClipboard, eventBus, readFile } from '@/utils';

type Props = {
	onLoad: () => void;
	onChange: (
		{
			svgIcon,
			component,
			filesDropped,
			settings,
		}: {
				svgIcon: string;
				component: string;
				filesDropped: File[];
				settings: Settings
			}
	) => void;
	svgIcon: string;
	component: string;
	filesDropped: File[];
	settings: Settings;
}

const ComponentEditorView = ({
	onLoad,
	onChange,
	svgIcon,
	component,
	filesDropped,
	settings,
}: Props) => {

	const [iconName, updateIconName] = useState(settings.iconName);

	const onClickLanguageOption = (language: Language) => {
		if (!settings.configToDownload) return;

		onChange({
			svgIcon,
			filesDropped,
			component,
			settings: {
				...settings,
				filesDroppedSteps: {
					...settings.filesDroppedSteps,
					framework: { ...settings.filesDroppedSteps.framework, here: false },
					language: { ...settings.filesDroppedSteps.language, here: false },
					download: { ...settings.filesDroppedSteps.download, here: true },
				},
				configToDownload: {
					...settings.configToDownload,
					language,
				},
			},
		});
	};

	const onCancelIconsDropped = () => {
		onChange({
			svgIcon: '',
			filesDropped: [],
			component: '',
			settings: {
				iconName: 'Icon',
				framework: FRAMEWORK_CONFIG[0],
				render: {
					label: '',
					name: '',
					mode: 'javascript',
				},
				filesDroppedSteps: {
					framework: { label: 'Select the framework', here: true },
					language: { label: 'Select the language', here: false },
					download: { label: 'Download', here: false },
				},
				editorMode: 'javascript',
				configToDownload: null,
			},
		});
	};

	const onClickFrameworkOption = (framework: Framework) => {
		onChange({
			svgIcon,
			filesDropped,
			component,
			settings: {
				...settings,
				filesDroppedSteps: {
					...settings.filesDroppedSteps,
					framework: { ...settings.filesDroppedSteps.framework, here: false },
					language: { ...settings.filesDroppedSteps.language, here: true },
				},
				configToDownload: {
					framework,
					language: 'javascript',
				},
			},
		});
	};

	async function downloadIcons() {
		if (!settings.configToDownload?.framework) return;

		const language = ((settings.configToDownload.framework.types || [])
			.find((framework) => framework.mode === settings.configToDownload?.language) || {}).name;

		if (!language) return;

		const framework = settings.configToDownload.framework.name;

		const filesContent: FileToUpload[] = (
			await Promise.all(
				filesDropped.map(async (file: File) => {
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

		onChange({
			svgIcon,
			filesDropped: [],
			component,
			settings: {
				...settings,
				configToDownload: null,
				filesDroppedSteps: {
					...settings.filesDroppedSteps,
					framework: { ...settings.filesDroppedSteps.framework, here: true },
					language: { ...settings.filesDroppedSteps.language, here: false },
					download: { ...settings.filesDroppedSteps.download, here: false },
				},
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

	const onFrameworkChange = async (framework: Framework, type?: FrameworkRenderType) => {
		onChange({
			svgIcon,
			component,
			filesDropped,
			settings: {
				...settings,
				framework,
				render: type || null as any,
				editorMode: type?.mode || framework.mode,
			},
		});
	};

	const onInput = (
		$event: ChangeEvent<HTMLInputElement>,
	) => {
		if (($event.nativeEvent as InputEvent).data === ' ') return;

		const value = $event.target.value.replace(/[\W\s]+/gi, '');
		updateIconName(value);

		debouncedChangeHandler({
			component,
			svgIcon,
			filesDropped,
			settings: {
				...settings,
				iconName: value,
			},
		});
	};

	const debouncedChangeHandler = useMemo(
		() => debounce(onChange, 300)
		, [],
	);

	const onClickCopyResult = () => {
		copyToClipboard(component);
	};

	return (
		<div
			className={[
				'Result w-full pl-4 h-full flex flex-col',
				!component && !filesDropped.length
					? 'pointer-events-none opacity-50'
					: '',
			].join(' ')}
			suppressHydrationWarning
		>
			{filesDropped.length ? (
				<div className="relative h-full w-full">
					<button className="absolute right-4 top-4 rounded-full bg-[#414853] p-2 hover:bg-[#272d35]" onClick={() => onCancelIconsDropped()}>
						<CrossIcon className="text-white" />
					</button>
					<div
						style={{ backgroundColor: '#3C4451' }}
						className={[
							'text-gray-200 h-full p-4 text-sm font-normal',
							filesDropped.length
								? 'flex flex-col items-center justify-center'
								: '',
						].join(' ')}
					>
						{settings.filesDroppedSteps.framework.here && <div>
							<h2 className="text-6xl">{ settings.filesDroppedSteps.framework.label }</h2>
							<ul className="flex flex-col">
								{FRAMEWORK_CONFIG.map((framework, key) => (
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
				<div className="flex h-full flex-col">
					{component && (
						<button
							onClick={onClickCopyResult}
							className={[
								'px-3 py-2 rounded-sm absolute right-10 top-24 z-10 bg-gray-900 text-white hover:opacity-70 focus:outline-none',
								settings.framework?.types?.length ? 'mt-8' : '',
							].join(' ')}
						>
							copy
						</button>
					)}

					<div className="Result__format">
						<ul className="flex bg-gray-700 p-2 text-xs text-white">
							{FRAMEWORK_CONFIG.map((framework, key) => (
								<li key={key}>
									<button
										className={[
											'mx-1 p-2 rounded-md hover:bg-gray-500 cursor-pointer flex items-center',
											framework.name === settings.framework.name
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
							className="m-1 w-full bg-gray-400 p-1 text-sm"
							value={iconName}
							onInput={onInput}
						/>
					</div>

					<div className="flex pb-1">
						{settings.framework?.types?.map(
							(type, key) => (
								<button
									className={[
										'text-xs text-white mx-1 p-2 rounded-md hover:bg-gray-500 cursor-pointer flex items-center',
										type.name === settings.render.name
											? 'bg-gray-400'
											: 'bg-gray-700',
									].join(' ')}
									key={`${key}f.label`}
									onClick={() => onFrameworkChange(settings.framework, type)}
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
							value={component}
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