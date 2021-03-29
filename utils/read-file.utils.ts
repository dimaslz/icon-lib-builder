export default function readFile(file: File, cb?: (content: string) => void): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			let reader = new FileReader();
			reader.onload = (event: ProgressEvent) => {
				if (event.target instanceof FileReader) {
					const target: FileReader = event.target;
					if (typeof target.result === 'string') {
						let result: string = target.result;
						if (!result) throw new Error('No file content');

						if (cb) cb(result);
						resolve(result);
					}
				}
			};
			reader.readAsText(file);
		}
		catch (err) {
			return reject();
		}
	});
}