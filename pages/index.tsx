import Head from 'next/head';
import React, { ChangeEvent, useState } from 'react';
import isSvg from 'is-svg';
import _ from 'lodash';
import { SandpackPredefinedTemplate } from '@codesandbox/sandpack-react';


import ForkMeOnGithub from '../components/fork-me-on-github.component';

import FileToUpload from '../entity-type/FileToUpload.type';
import Framework from '../entity-type/Framework.type';

import eventBus from '../utils/event-bus.utils';

import {
	CodeEditor,
	DropZone,
	FullScreenLoading,
	Icon,
	Footer,
	Notification,
	Preview,
} from '../components';
import { autoDownload, readFile, copyToClipboard } from '../utils';

import frameworks from '../constants/frameworks.constants';

import API from '../api';
import { ViewIcon, JSIcon, TSIcon, CopyIcon } from '../components/icons';

const initialPlaceholder = 'paste your SVG string here or drop some SVG files';
const Home = (): JSX.Element => {
	const [iconName, setIconName] = useState<string>('Icon');
	const [svgString, setSvgString] = useState<string>('');
	const [componentString, setComponentString] = useState('');
	const [currentFramework, setCurrentFramework] = useState(frameworks[0]);
	const [editorMode, setEditorMode] = useState('javascript');
	const [isPasted, setIsPasted] = useState(false);
	const [isPlaceholder, setIsPlaceholder] = useState(true);
	const [sourceEditorReady, setSourceEditorReady] = useState(false);
	const [resultEditorReady, setResultEditorReady] = useState(false);
	const [filesDropped, setFilesDropped] = useState<File[]>([]);
	const [frameworkLang, setFrameworkLang] = useState<any>([]);
	const [showPreview, setShowPreview] = useState<boolean>(false);
	const [previewTemplate, setPreviewTemplate] = useState<SandpackPredefinedTemplate>('react');

	const isBrowser = typeof window !== 'undefined';

	async function onPaste(value: string) {
		setIsPasted(true);
		await new Promise((resolve) => {
			setTimeout(() => {
				setSvgString('');

				resolve('');
			}, 100);
		});

		setSvgString(value);

		if (value) {
			await requestToFormat(value);
		}

		setIsPlaceholder(false);
	}

	async function onChange(value: string): Promise<string | void> {
		if (!isPasted && value) {
			await requestToFormat(value, iconName);
		} else {
			setIsPasted(false);
		}

		if (!value) {
			setSvgString('');
			setComponentString('');
		}
	}

	async function requestToFormat(value: string, iconName?: string, type?: string) {
		try {
			let svgFormatted = await API.formatter({
				script: value,
				framework: 'svg',
			});
			if (!svgFormatted) return;

			svgFormatted = svgFormatted.replace(/>;/g, '>');
			svgFormatted = svgFormatted.trim();

			setSvgString(svgFormatted);

			const t = type || currentFramework.types?.[0];
			const script = await API.formatter({
				script: svgFormatted,
				framework: currentFramework.name,
				iconName,
				...(t ? { type: t.name } : {}),
			});
			setComponentString(script);
			setEditorMode(t?.mode);
			setFrameworkLang(t);
		} catch (err) {
			console.log('Err', err);
			setSvgString(value);

			eventBus.publish('notification', {
				message: 'Looks like the source code is not a valid format',
			});
		}
	}

	async function onFrameworkChange(framework: Framework, type?: any) {
		const noTypes = !framework.types?.length;

		setCurrentFramework(framework);

		let script = '';
		if (noTypes) {
			script = await API.formatter({
				script: svgString,
				framework: framework.name,
				iconName,
			});

		} else {
			const defaultType = (framework.types || [])[0];
			setFrameworkLang(type || defaultType);
			script = await API.formatter({
				script: svgString,
				framework: framework.name,
				iconName,
				type: type?.name || defaultType.name,
			});
		}

		setComponentString(script);
		setEditorMode(type?.mode || framework.mode);
	}

	function onClickCopyResult() {
		copyToClipboard(componentString);
	}

	async function handleDrop($event: Event, files: FileList) {
		if (!isBrowser) return;

		$event.preventDefault();
		$event.stopPropagation();

		const isMultiple = files.length > 1;
		if (isMultiple) {
			const arrFiles = Array.from(files);
			setSvgString('');
			setComponentString('');
			setFilesDropped([...arrFiles]);

			return;
		}

		setFilesDropped([]);
		const file = files[0];
		const value = await readFile(file);

		if (!isSvg(value)) return; // TODO: Send Notification error

		let svgFormatted = await API.formatter({
			script: value,
			framework: 'svg',
		});

		svgFormatted = svgFormatted.replace(/>;/g, '>');
		setSvgString(svgFormatted);

		const script = await API.formatter({
			script: svgFormatted,
			framework: currentFramework.name,
		});

		setComponentString(script);
	}

	async function downloadFile(filename: string) {
		try {
			const blob = await API.downloadFilename(filename);

			autoDownload(blob, filename);
			setFilesDropped([]);
		} catch (err) {
			eventBus.publish('notification', {
				message: 'Problem uploading files',
			});
		}
	}

	async function downloadWithFramework(framework: Framework) {
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
				const filesUploaded: any = await API.uploadFiles(
					filesContent,
					framework.name,
				);

				downloadFile(filesUploaded?.file);
			} catch (err) {
				console.error('Err: ', err);
			}
		}
	}

	function onLoadSourceCodeEditor() {
		setSourceEditorReady(true);
	}

	function onLoadResultCodeEditor() {
		setResultEditorReady(true);
	}

	function onClickFrameworkOption(framework: Framework) {
		return () => downloadWithFramework(framework);
	}

	function onChangeIconNameHandler(
		$event: ChangeEvent<HTMLInputElement>,
	) {
		if (($event.nativeEvent as InputEvent).data === ' ') return;

		const value = $event.target.value.replace(/[\W\s]+/gi, '');
		setIconName(() => value);

		if (value) {
			requestToFormat(svgString, value);
		}
	}

	function onClickPreviewResult() {
		const templates: any = {
			'react-js': 'react',
			'react-ts': 'react-ts',
		};

		const templateKey = `${currentFramework.name}-${frameworkLang.name}`;
		const template: SandpackPredefinedTemplate = templates[templateKey];
		// const template: SandpackPredefinedTemplate = `${currentFramework.name}-${frameworkLang.name}` as SandpackPredefinedTemplate;

		console.log('template', template);
		setPreviewTemplate(() => template);
		setShowPreview(() => true);
	}

	function onClosePreviewResult() {
		setShowPreview(() => false);
	}

	function onSetIsPlaceholder(): void {
		setSvgString('');
		setComponentString('');
		setIsPlaceholder(true);
	}

	return (
		<div className="w-full my-0 mx-auto h-screen flex flex-col justify-start items-center bg-gray-600">
			<ForkMeOnGithub />

			{showPreview && (
				<Preview
					template={previewTemplate}
					html={componentString}
					onClose={onClosePreviewResult}
				/>
			)}

			<Head>
				<title>Icon library builder | dimaslz.dev</title>
				<link rel="icon" href="/favicon.ico" />
				<meta charSet="utf-8" />
				<meta
					property="og:title"
					content="Icon library builder | dimaslz.dev"
					key="title"
				/>
				<meta
					property="og:description"
					content="Tool to generate a framework component from SVG icon | dimaslz.dev"
					key="description"
				/>
			</Head>

			<main className="flex flex-col items-center w-full justify-start flex-grow">
				<header className="h-16 bg-gray-800 w-full flex items-center justify-center text-white text-sm">
					icon library <Icon className="text-gray-400" width="50" height="50" />{' '}
					builder
				</header>

				<div className="flex w-full h-full relative">
					{!sourceEditorReady && !resultEditorReady ? (
						<FullScreenLoading />
					) : null}
					<DropZone onDrop={handleDrop}>
						{filesDropped.length > 0 ? (
							<div
								style={{ backgroundColor: '#3C4451' }}
								className="text-gray-200 h-full p-4 text-sm font-normal"
							>
								{filesDropped.map((file: File, key: number) => (
									<div key={key}>{file.name}</div>
								))}
							</div>
						) : (
							<div className="relative w-full h-full">
								{!isPlaceholder && (
									<button
										onClick={onSetIsPlaceholder}
										className="px-3 py-2 rounded-sm absolute right-5 top-5 z-10 bg-gray-900 text-white hover:opacity-70 focus:outline-none"
									>
										clean
									</button>
								)}
								<CodeEditor
									placeholder={initialPlaceholder}
									name="source"
									onPaste={onPaste}
									onChange={_.debounce(onChange, 200)}
									value={svgString}
									onLoad={onLoadSourceCodeEditor}
								/>
							</div>
						)}
					</DropZone>
					<div
						className={[
							'Result w-full pl-4 h-full flex flex-col',
							!componentString && !filesDropped.length
								? 'pointer-events-none opacity-50'
								: '',
						].join(' ')}
						suppressHydrationWarning
					>
						{filesDropped.length ? (
							<div
								style={{ backgroundColor: '#3C4451' }}
								className={[
									'text-gray-200 h-full p-4 text-sm font-normal',
									filesDropped.length
										? 'flex flex-col items-center justify-center'
										: '',
								].join(' ')}
							>
								<ul className="flex flex-col">
									{frameworks.map((framework, key) => (
										<li
											className={[
												'mx-1 p-4 rounded-full hover:bg-gray-500 cursor-pointer my-2 bg-gray-700',
											].join(' ')}
											key={key}
											onClick={onClickFrameworkOption(framework)}
										>
											download for {framework.label.toUpperCase()}
										</li>
									))}
								</ul>
							</div>
						) : (
							<div className="flex flex-col h-full">
								{componentString && (
									<div className="absolute right-10 top-24 z-10">
										<button
											onClick={onClickCopyResult}
											className={[
												'px-3 py-2 rounded-md bg-gray-900 text-white hover:opacity-70 focus:outline-none flex items-center',
												currentFramework?.types?.length ? 'mt-8' : '',
											].join(' ')}
										>
											<CopyIcon /><span className="ml-1">copy</span>
										</button>
										<button
											onClick={onClickPreviewResult}
											className={[
												'px-3 py-2 rounded-md bg-gray-900 text-white hover:opacity-70 focus:outline-none flex items-center mt-1',
											].join(' ')}
										>
											<ViewIcon /><span className="ml-1">preview</span>
										</button>

									</div>
								)}

								<div className="Result__format">
									<ul className="text-xs text-white flex bg-gray-700 p-2">
										{frameworks.map((framework, key) => (
											<li key={key}>
												<button
													className={[
														'mx-1 p-2 rounded-md hover:bg-gray-500 cursor-pointer flex items-center',
														framework.name === currentFramework.name
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
										value={iconName}
										onChange={onChangeIconNameHandler}
									/>
								</div>

								<div className="pb-1 flex">
									{currentFramework?.types?.map(
										(t: any, key: number) => (
											<button
												className={[
													'text-xs text-white mx-1 p-2 rounded-md hover:bg-gray-500 cursor-pointer flex items-center',
													t.name === frameworkLang.name
														? 'bg-gray-400'
														: 'bg-gray-700',
												].join(' ')}
												key={`${key}f.label`}
												onClick={() => onFrameworkChange(currentFramework, t)}
											>
												{['ts', 'compressed'].includes(t.name) &&
													<span><TSIcon className="text-blue-500" /></span>
												}
												{['js'].includes(t.name) &&
													<span><JSIcon className="text-yellow-500" /></span>
												}
												<span className="ml-2">{t.label}</span>
											</button>
										),
									)}
								</div>

								<div className="h-full">
									<CodeEditor
										placeholder="Here you will have your code formated in the framework as you want"
										name="result"
										value={componentString}
										readOnly
										mode={editorMode}
										onLoad={onLoadResultCodeEditor}
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</main>

			<Notification />
			<Footer />
		</div>
	);
};

export default Home;
