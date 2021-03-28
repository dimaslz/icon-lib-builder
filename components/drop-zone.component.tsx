import { useEffect, useRef, useState } from "react"

type Props = {
	children: any,
	onDrop: ($event: DragEvent, files: FileList) => void,
};

export default function DropZoneComponent({ children, onDrop }: Props) {
	let dropZoneRef = useRef<HTMLElement>(null);
	let dropZoneOverlayRef = useRef<HTMLElement>(null);
	const [dragAndDrop, setDragAndDrop] = useState(false);

	function handleDragIn($event: DragEvent) {
    $event.preventDefault();
    $event.stopPropagation();

    if (!!$event.dataTransfer?.items.length) {
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

    if (!!$event.dataTransfer?.items.length) {
			onDrop($event, $event.dataTransfer.files);
		}

		setDragAndDrop(false);
  }

	useEffect(() => {
    const dropZone: HTMLElement | null = dropZoneRef.current;
    dropZone?.addEventListener('dragenter', handleDragIn as () => {});
    dropZone?.addEventListener('dragover', handleDrag as () => {});
    dropZone?.addEventListener('drop', handleDrop as () => {});

    const dropZoneOverlay: HTMLElement | null = dropZoneOverlayRef.current;
		dropZoneOverlay?.addEventListener('dragleave', handleDragOut as () => {});

    return () => {
      dropZone?.removeEventListener('dragenter', handleDragIn as () => {});
      dropZone?.removeEventListener('dragover', handleDrag as () => {});
      dropZone?.removeEventListener('drop', handleDrop as () => {});

      dropZoneOverlay?.removeEventListener('dragleave', handleDragOut as () => {});
    }
  });

	return (
		<div
			className="Source h-full w-full relative inline-block"
			ref={dropZoneRef as any}
		>
			{dragAndDrop && <div className="absolute top-0 left-0 right-0 bottom-0 bg-white z-50 flex items-center justify-center opacity-20"
				ref={dropZoneOverlayRef as any}
			>
				<div className="pointer-events-none">drop here :)</div>
			</div>}
			{children}
		</div>
	)
}