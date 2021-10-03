export default function readFile(file: File, cb?: (content: string) => void): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event: ProgressEvent) => {
			if (event.target instanceof FileReader) {
				const target: FileReader = event.target;
				if (typeof target.result === 'string') {
					const result: string = target.result;
					if (!result) reject('No file content');

					if (cb) cb(result);
					resolve(result);
				}
			}
		};
		reader.readAsText(file);
	});
}