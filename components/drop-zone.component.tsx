import React, { ReactNode, useEffect, useRef, useState } from 'react';

import DropIcon from './icons/DropIcon.component';

type Props = {
	children: ReactNode,
	onDrop: ($event: DragEvent, files: FileList) => void,
};

export const DropZoneComponent: React.FC<Props> = ({ children, onDrop }) => {
	const dropZoneRef = useRef<HTMLDivElement>(null);
	const dropZoneOverlayRef = useRef<HTMLDivElement>(null);

	const [dragAndDrop, setDragAndDrop] = useState(false);

	function handleDragIn($event: DragEvent) {
		$event.preventDefault();
		$event.stopPropagation();

		console.log('DRAGIN', $event.dataTransfer?.items.length);
		if ($event.dataTransfer?.items.length) {
			setDragAndDrop(true);
		}
	}

	function handleDragOut($event: DragEvent) {
		$event.preventDefault();
		$event.stopPropagation();

		setDragAndDrop(false);
	}

	function handleDrag($event: DragEvent) {
		$event.preventDefault();
		$event.stopPropagation();
	}

	function handleDrop($event: DragEvent) {
		$event.preventDefault();
		$event.stopPropagation();

		console.log('DROP A', $event.dataTransfer?.items.length);
		console.log('DROP B', $event.dataTransfer?.files[0].name);
		if ($event.dataTransfer?.items.length) {
			onDrop($event, $event.dataTransfer.files);
		}

		setDragAndDrop(false);
	}

	useEffect(() => {
		const dropZone: HTMLElement | null = dropZoneRef.current;
		dropZone?.addEventListener('dragenter', handleDragIn);
		dropZone?.addEventListener('dragover', handleDrag);
		dropZone?.addEventListener('drop', handleDrop);

		const dropZoneOverlay: HTMLElement | null = dropZoneOverlayRef.current;
		dropZoneOverlay?.addEventListener('dragleave', handleDragOut);

		return () => {
			dropZone?.removeEventListener('dragenter', handleDragIn);
			dropZone?.removeEventListener('dragover', handleDrag);
			dropZone?.removeEventListener('drop', handleDrop);

			dropZoneOverlay?.removeEventListener('dragleave', handleDragOut);
		};
	});

	return (
		<div
			className="Source relative inline-block h-full w-full"
			ref={dropZoneRef}
		>
			{dragAndDrop &&
				<div
					className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#282A36] font-mono font-thin text-white"
					ref={dropZoneOverlayRef}
				>
					<DropIcon size={100} className="pointer-events-none mb-6 text-white opacity-80" />
					<div className="pointer-events-none">drop file here</div>
				</div>}
			{children}
		</div>
	);
};

export default DropZoneComponent;