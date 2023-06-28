import isSvg from 'is-svg';
import debounce from 'lodash/debounce';

import Api from '@/api';
import { DropZone, DynamicCodeEditor } from '@/components';
import { useSettings } from '@/hooks';
import { readFile } from '@/utils';


const initialPlaceholder = 'paste SVG string content or drop multiple SVG files here';

type Props = {
	onLoad: () => void;
};

const isBrowser = typeof window !== 'undefined';

const SVGEditor = ({
	onLoad,
}: Props) => {
	const { settings, updateSettings } = useSettings();

	const onChange = (value: string) => {
		if (!value) {
			updateSettings({
				svgString: '',
				componentString: '',
			});
		}
	};

	const onCleanEditor = () => {
		updateSettings({
			svgString: '',
			componentString: '',
		});
	};

	const onDropFiles = async ($event: Event, files: FileList) => {
		if (!isBrowser) return;

		$event.preventDefault();
		$event.stopPropagation();

		const isMultiple = files.length > 1;
		if (isMultiple) {
			const arrFiles = Array.from(files);

			updateSettings({
				svgString: '',
				componentString: '',
				filesDropped: [...arrFiles],
			});

			return;
		}

		const file = files[0];
		const value = await readFile(file);

		if (!isSvg(value)) return; // TODO: Send Notification error

		let svgFormatted = await Api.formatter({
			script: value,
			framework: 'svg',
		});

		svgFormatted = svgFormatted.replace(/>;/g, '>');

		const script = await Api.formatter({
			script: svgFormatted,
			framework: settings.currentFramework.name,
		});

		updateSettings({
			filesDropped: [],
			svgString: svgFormatted,
			componentString: script,
		});
	};

	return (
		<DropZone onDrop={onDropFiles}>
			{settings.filesDropped.length > 0 ?  (
				<div
					className="h-full bg-[#3C4451] p-4 text-sm font-normal text-gray-200"
				>
					{settings.filesDropped.map((file: File, key: number) => (
						<div key={key}>{file.name}</div>
					))}
				</div>
			) : (
				<div className="relative h-full w-full">
					{settings.svgString && (
						<button
							onClick={onCleanEditor}
							className="absolute right-2 top-5 z-10 rounded-sm bg-gray-900 px-3 py-2 text-white hover:opacity-70 focus:outline-none"
						>
								clean
						</button>
					)}
					<DynamicCodeEditor
						placeholder={initialPlaceholder}
						name="source"
						onChange={debounce(onChange, 200)}
						value={settings.svgString}
						onLoad={onLoad}
					/>
				</div>
			)}
		</DropZone>
	);
};

export default SVGEditor;