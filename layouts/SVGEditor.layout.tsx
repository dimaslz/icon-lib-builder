import isSvg from 'is-svg';
import debounce from 'lodash/debounce';

import { DropZone, DynamicCodeEditor } from '@/components';
import { readFile } from '@/utils';


const initialPlaceholder = 'paste SVG string content or drop multiple SVG files here';

type Props = {
	onLoad: () => void;
	onChange: ({ svgIcon, filesDropped }: { svgIcon: string; filesDropped?: File[]; }) => void;
	svgIcon: string;
	filesDropped: File[];
};

const isBrowser = typeof window !== 'undefined';

const SVGEditor = ({
	onLoad,
	onChange,
	svgIcon,
	filesDropped,
}: Props) => {
	const _onChange = (value: string) => {
		if (!value) {
			onChange({
				svgIcon: '',
			});
		} else {
			onChange({
				svgIcon: value,
			});
		}
	};

	const onCleanEditor = () => {
		onChange({
			svgIcon: '',
			filesDropped: [],
		});
	};

	const onDropFiles = async ($event: Event, files: FileList) => {
		if (!isBrowser) return;

		$event.preventDefault();
		$event.stopPropagation();

		const isMultiple = files.length > 1;
		if (isMultiple) {
			const arrFiles = Array.from(files);

			onChange({
				svgIcon: '',
				filesDropped: [...arrFiles],
			});

			return;
		}

		const file = files[0];
		const value = await readFile(file);

		if (!isSvg(value)) return; // TODO: Send Notification error

		onChange({
			svgIcon: value,
		});
	};

	return (
		<DropZone onDrop={onDropFiles}>
			{filesDropped.length > 0 ?  (
				<div
					className="h-full bg-[#3C4451] p-4 text-sm font-normal text-gray-200"
				>
					{filesDropped.map((file: File, key: number) => (
						<div key={key}>{file.name}</div>
					))}
				</div>
			) : (
				<div className="relative h-full w-full">
					{svgIcon && (
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
						onChange={debounce(_onChange, 200)}
						value={svgIcon}
						onLoad={onLoad}
					/>
				</div>
			)}
		</DropZone>
	);
};

export default SVGEditor;