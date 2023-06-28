import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import Api from '@/api';
import {
	Footer,
	FullScreenLoading,
	Header,
	Notification,
} from '@/components';
import type { FrameworkRenderType } from '@/entity-type';
import { useSettings } from '@/hooks';
import { ComponentEditorView, SVGEditor } from '@/layouts';
import { eventBus } from '@/utils';


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
		<div className="mx-auto my-0 flex h-screen w-full flex-col items-center justify-start bg-gray-600">
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

			<main className="flex w-full grow flex-col items-center justify-start">
				<Header />

				<div className="relative flex h-full w-full">
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
