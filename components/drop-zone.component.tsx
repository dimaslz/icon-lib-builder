import React, { useEffect, useRef, useState } from 'react';
import DropIcon from './icons/DropIcon.component';

type Props = {
	children: any,
	onDrop: ($event: DragEvent, files: FileList) => void,
};

export const DropZoneComponent: React.FC<Props> = ({ children, onDrop }) => {
	const dropZoneRef = useRef<HTMLDivElement>(null);
	const dropZoneOverlayRef = useRef<HTMLDivElement>(null);

	const [dragAndDrop, setDragAndDrop] = useState(false);

	function handleDragIn($event: DragEvent) {
		$event.preventDefault();
		$event.stopPropagation();

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
			className="Source h-full w-full relative inline-block"
			ref={dropZoneRef}
		>
			{dragAndDrop &&
				<div
					className="absolute top-0 left-0 right-0 bottom-0 bg-[#282A36] z-50 flex items-center justify-center font-mono text-white font-thin flex-col"
					ref={dropZoneOverlayRef}
				>
					<DropIcon size={100} className="text-white mb-6 opacity-80 pointer-events-none" />
					<div className="pointer-events-none">drop file here</div>
				</div>}
			{children}
		</div>
	);
};

export default DropZoneComponent;