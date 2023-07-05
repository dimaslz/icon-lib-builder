import Head from 'next/head';
import React, { useMemo, useState } from 'react';

import Api from '@/api';
import {
	Footer,
	FullScreenLoading,
	Header,
	Notification,
} from '@/components';
import ForkMeOnGithub from '@/components/fork-me-on-github.component';
import { FRAMEWORK_CONFIG, INITIAL_SETTINGS } from '@/constants';
import type { Framework, FrameworkRenderType, Language, Settings } from '@/entity-type';
import { ComponentEditorView, SVGEditor } from '@/layouts';
import { eventBus } from '@/utils';


const Home = (): JSX.Element => {
	const [sourceEditorReady, setSourceEditorReady] = useState(false);
	const [resultEditorReady, setResultEditorReady] = useState(false);

	const [svgIcon, updateSvgIcon] = useState('');
	const [component, updateComponent] = useState('');

	const [filesDropped, updateFilesDropped] = useState<File[]>([]);
	const [componentSettings, updateComponentSettings] = useState<Settings>(INITIAL_SETTINGS);

	const isLoading = useMemo(() => (
		!sourceEditorReady && !resultEditorReady
	), [sourceEditorReady, resultEditorReady]);

	const requestToFormat = async (
		value: string,
		iconName = 'Icon',
		framework: Framework,
		render: FrameworkRenderType,
	): Promise<{
		settings: {
			editorMode: Language;
			render: FrameworkRenderType;
		};
		svgIcon: string;
		component: string;
	} | undefined> => {
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
			const renderType: FrameworkRenderType = render || framework?.types![0];

			const script = await Api.formatter({
				script: svgFormatted,
				framework: framework.name,
				iconName,
				...(renderType ? { type: renderType.name } : {}),
			});

			return {
				settings: {
					editorMode: renderType?.mode || 'typescript',
					render: renderType,
				},
				svgIcon: svgFormatted,
				component: script,
			};
		} catch (err) {
			console.log('Err', err);
			updateSvgIcon(value);

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

	const formatToFrameworkComponent = async (value: string) => {
		const script = await Api.formatter({
			script: value,
			framework: FRAMEWORK_CONFIG[0].name,
		});

		updateComponent(script);
	};

	const formatSvgIcon = async (value: string) => {
		let svgFormatted = await Api.formatter({
			script: value,
			framework: 'svg',
		});

		svgFormatted = svgFormatted.replace(/>;/g, '>');
		updateSvgIcon(svgFormatted);

		return svgFormatted;
	};

	const onChangeComponentEditor = async (
		{
			svgIcon,
			filesDropped,
			settings,
		}:
			{
				svgIcon: string;
				filesDropped: File[];
				settings: Settings;
			},
	) => {
		await updateFilesDropped(filesDropped);

		if (filesDropped.length > 1) {
			await updateComponentSettings({
				...componentSettings,
				...settings,
			});
			return;
		};

		if (!svgIcon) return;

		const requestResponse = await requestToFormat(
			svgIcon,
			settings.iconName,
			settings.framework,
			settings.render,
		);

		if (!requestResponse) return;

		await updateSvgIcon(requestResponse.svgIcon);
		await updateComponent(requestResponse.component);

		await updateComponentSettings({
			...componentSettings,
			...settings,
			...requestResponse.settings,
		});
	};

	const onChangeSvgEditor = async (
		{ svgIcon, filesDropped = [] }: { svgIcon: string; filesDropped?: File[]; },
	) => {
		if (filesDropped?.length) {
			updateSvgIcon('');
			updateComponent('');
			updateFilesDropped(filesDropped);
		}

		if (!svgIcon) {
			updateSvgIcon('');
			updateComponent('');

			return;
		};

		updateSvgIcon(svgIcon);

		const svgFormatted = await formatSvgIcon(svgIcon);
		formatToFrameworkComponent(svgFormatted);
	};

	return (
		<div className="mx-auto my-0 flex h-screen w-full flex-col items-center justify-start bg-gray-600">
			<ForkMeOnGithub />

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

			<Header />

			<main className="flex w-full grow flex-col items-center justify-start">
				<div className="relative flex h-full w-full">
					{isLoading ? <FullScreenLoading /> : null}

					<div className={[
							isLoading ? 'hidden' : 'visible',
							'flex w-full h-full',
						].join(' ')}
						aria-hidden={isLoading}
						data-testid="workzone"
					>
						<SVGEditor
							onLoad={onLoadSourceCodeEditor}
							onChange={onChangeSvgEditor}
							svgIcon={svgIcon}
							filesDropped={filesDropped}
						/>

						<ComponentEditorView
							onLoad={onLoadResultCodeEditor}
							onChange={onChangeComponentEditor}
							filesDropped={filesDropped}
							svgIcon={svgIcon}
							component={component}
							settings={componentSettings}
						/>
					</div>
				</div>
			</main>

			<Notification />
			<Footer />
		</div>
	);
};

export default Home;
