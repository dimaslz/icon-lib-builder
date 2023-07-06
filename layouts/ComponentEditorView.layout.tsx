import { Editor } from '@monaco-editor/react';
import debounce from 'lodash/debounce';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

import Api from '@/api';
import { FrameworkButtonList, FrameworkRenderList } from '@/components';
import { CrossIcon } from '@/components/icons';
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

	const [iconName, updateIconName] = useState<string>('');

	useEffect(() => {
		updateIconName(settings.iconName);
	}, [settings.iconName]);

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

	const downloadIcons = async () => {
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
	};

	const downloadFile = async (filename: string) => {
		try {
			const blob = await Api.downloadFilename(filename);

			autoDownload(blob, filename);
		} catch (err) {
			eventBus.publish('notification', {
				message: 'Problem uploading files',
			});
		}
	};

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
											aria-label={`${framework.label.toUpperCase()} framework`}
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
					<FrameworkButtonList
						frameworks={FRAMEWORK_CONFIG}
						onClick={onFrameworkChange}
						selected={settings.framework.name}
					/>

					<div className="IconName pb-2">
						<input
							type="text"
							className="m-1 w-full bg-gray-400 p-1 text-sm"
							value={iconName}
							onInput={onInput}
						/>
						<FrameworkRenderList
							types={settings.framework?.types}
							onChange={onFrameworkChange}
							selected={settings.render?.name}
							framework={settings.framework}
							className="h-8"
						/>
					</div>

					<div className="relative h-full">
						<Editor
							options={{ readOnly: true, minimap: { enabled: false } }}
							value={component}
							theme="vs-dark"
							onMount={onLoad}
							width="100%"
							height="100%"
							language={settings.editorMode}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default ComponentEditorView;