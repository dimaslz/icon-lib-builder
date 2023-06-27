import Head from 'next/head';
import React, { useEffect, useState } from 'react';


import {
	FullScreenLoading,
	Footer,
	Notification,
	Header,
} from '@/components';
import { eventBus } from '@/utils';
import Api from '@/api';
import { SVGEditor, ComponentEditorView } from '@/layouts';
import { useSettings } from '@/hooks';
import { FrameworkRenderType } from '@/entity-type';


const Home = (): JSX.Element => {
	const { settings, updateSettings } = useSettings();

	const [sourceEditorReady, setSourceEditorReady] = useState(false);
	const [resultEditorReady, setResultEditorReady] = useState(false);

	const requestToFormat = async (value: string, iconName = 'Icon') => {
		if (!value) return;

		try {
			let svgFormatted = await Api.formatter({
				script: value,
				framework: 'svg',
			});
			if (!svgFormatted) return;

			svgFormatted = svgFormatted.replace(/>;/g, '>');
			svgFormatted = svgFormatted.trim();

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const renderType: FrameworkRenderType = settings.currentFramework.types![0];

			const script = await Api.formatter({
				script: svgFormatted,
				framework: settings.currentFramework.name,
				iconName,
				...(renderType ? { type: renderType.name } : {}),
			});

			updateSettings({
				svgString: svgFormatted,
				componentString: script,
				editorMode: renderType.mode,
				frameworkRenderType: renderType,
			});
		} catch (err) {
			console.log('Err', err);
			updateSettings({
				svgString: value,
			});

			eventBus.publish('notification', {
				message: 'Looks like the source code is not a valid format',
			});
		}
	};

	const onLoadSourceCodeEditor = () => {
		setSourceEditorReady(true);
	};

	const onLoadResultCodeEditor = () => {
		setResultEditorReady(true);
	};

	useEffect(() => {
		if (!settings.iconName) return;

		requestToFormat(settings.svgString, settings.iconName);
	}, [settings.iconName]);

	useEffect(() => {
		if (!settings.svgString) return;

		requestToFormat(settings.svgString, settings.iconName);
	}, [settings.svgString]);

	return (
		<div className="w-full my-0 mx-auto h-screen flex flex-col justify-start items-center bg-gray-600">
			{/* <ForkMeOnGithub /> */}

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
				<Header />

				<div className="flex w-full h-full relative">
					{!sourceEditorReady && !resultEditorReady ? (
						<FullScreenLoading />
					) : null}

					<SVGEditor
						onLoad={onLoadSourceCodeEditor}
					/>

					<ComponentEditorView
						onLoad={onLoadResultCodeEditor}
					/>
				</div>
			</main>

			<Notification />
			<Footer />
		</div>
	);
};

export default Home;
