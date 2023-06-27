import { useEffect } from 'react';
import { act, renderHook } from '@testing-library/react';

import useSettings from './useSettings';
import { FilesDroppedSteps, Framework, FrameworkRenderType, Language } from '@/entity-type';

describe('Hook - useSettings', () => {
	test('default values', async () => {
		const { result } = await renderHook(() => useSettings());

		expect(result.current).toStrictEqual({
			settings: {
				componentString: '',
				currentFramework: {
					icon: expect.any(Function),
					label: 'React',
					mode: 'javascript',
					name: 'react',
					types: [
						{
							label: 'Javascript v1',
							mode: 'javascript',
							name: 'js-v1',
						},
						{
							label: 'Javascript v2',
							mode: 'javascript',
							name: 'js-v2',
						},
						{
							label: 'TypeScript',
							mode: 'typescript',
							name: 'ts',
						},
					],
				},
				editorMode: 'javascript',
				filesConfigToDownload: null,
				filesDropped: [],
				filesDroppedSteps: {
					download: {
						here: false,
						label: 'Download',
					},
					framework: {
						here: true,
						label: 'Select the framework',
					},
					language: {
						here: false,
						label: 'Select the language',
					},
				},
				frameworkRenderType: {
					label: '',
					mode: 'javascript',
					name: '',
				},
				iconName: 'Icon',
				svgString: '',
			},
			updateSettings: expect.any(Function),
		});
	});

	test('update svgString', async () => {
		const expected = await act(async () => {
			const { result } = await renderHook(() => {
				const { settings, updateSettings } = useSettings();

				useEffect(() => {
					updateSettings({
						svgString: 'foo',
					});
				}, []);

				return settings;
			});

			return result;
		});

		expect(expected.current.svgString).toBe('foo');
	});

	test('update componentString', async () => {
		const expected = await act(async () => {
			const { result } = await renderHook(() => {
				const { settings, updateSettings } = useSettings();

				useEffect(() => {
					updateSettings({
						componentString: 'foo',
					});
				}, []);

				return settings;
			});

			return result;
		});

		expect(expected.current.componentString).toBe('foo');
	});

	test('update filesDropped', async () => {
		const filesDropped = [{
			lastModified: new Date().getTime(),
			name: 'interface-edit-attachment.svg',
			size: 339,
			type: 'image/svg+xml',
			webkitRelativePath: '',
		} as File];

		const expected = await act(async () => {
			const { result } = await renderHook(() => {
				const { settings, updateSettings } = useSettings();

				useEffect(() => {
					updateSettings({ filesDropped });
				}, []);

				return settings;
			});

			return result;
		});

		expect(expected.current.filesDropped).toStrictEqual(filesDropped);
	});

	test('update filesDroppedSteps', async () => {
		const filesDroppedSteps: FilesDroppedSteps = {
			framework: { label: 'Select the framework', here: true },
			language: { label: 'Select the language', here: false },
			download: { label: 'Download', here: false },
		};

		const expected = await act(async () => {
			const { result } = await renderHook(() => {
				const { settings, updateSettings } = useSettings();

				useEffect(() => {
					updateSettings({ filesDroppedSteps });
				}, []);

				return settings;
			});

			return result;
		});

		expect(expected.current.filesDroppedSteps).toStrictEqual(filesDroppedSteps);
	});

	test('update frameworkRenderType', async () => {
		const frameworkRenderType: FrameworkRenderType = {
			name: '',
			label: '',
			mode: 'javascript',
		};

		const expected = await act(async () => {
			const { result } = await renderHook(() => {
				const { settings, updateSettings } = useSettings();

				useEffect(() => {
					updateSettings({ frameworkRenderType });
				}, []);

				return settings;
			});

			return result;
		});

		expect(expected.current.frameworkRenderType).toStrictEqual(frameworkRenderType);
	});

	test('update currentFramework', async () => {
		const currentFramework: Framework = {
			icon: expect.any(Function),
			label: 'React',
			name: 'react',
			mode: 'javascript',
			types: [
				{
					label: 'Javascript v1',
					name: 'js-v1',
					mode: 'javascript',
				},
				{
					label: 'Javascript v2',
					name: 'js-v2',
					mode: 'javascript',
				},
				{
					label: 'TypeScript',
					name: 'ts',
					mode: 'typescript',
				},
			],
		};

		const expected = await act(async () => {
			const { result } = await renderHook(() => {
				const { settings, updateSettings } = useSettings();

				useEffect(() => {
					updateSettings({ currentFramework });
				}, []);

				return settings;
			});

			return result;
		});

		expect(expected.current.currentFramework).toStrictEqual(currentFramework);
	});

	test('update editorMode', async () => {
		const editorMode: Language = 'typescript';

		const expected = await act(async () => {
			const { result } = await renderHook(() => {
				const { settings, updateSettings } = useSettings();

				useEffect(() => {
					updateSettings({ editorMode });
				}, []);

				return settings;
			});

			return result;
		});

		expect(expected.current.editorMode).toStrictEqual(editorMode);
	});

	test('update editorMode', async () => {
		const filesConfigToDownload: {
			framework: Framework,
			language: Language;
		} = {
			framework: {
				icon: expect.any(Function),
				label: 'React',
				name: 'react',
				mode: 'javascript',
				types: [
					{
						label: 'Javascript v1',
						name: 'js-v1',
						mode: 'javascript',
					},
					{
						label: 'Javascript v2',
						name: 'js-v2',
						mode: 'javascript',
					},
					{
						label: 'TypeScript',
						name: 'ts',
						mode: 'typescript',
					},
				],
			},
			language: 'typescript',
		};

		const expected = await act(async () => {
			const { result } = await renderHook(() => {
				const { settings, updateSettings } = useSettings();

				useEffect(() => {
					updateSettings({ filesConfigToDownload });
				}, []);

				return settings;
			});

			return result;
		});

		expect(expected.current.filesConfigToDownload).toStrictEqual(filesConfigToDownload);
	});
});
