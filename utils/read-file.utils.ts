export default function readFile(file: File, cb?: (content: string) => void): Promise<string> {
	return new Promise(resolve => {
		let reader = new FileReader();
		reader.onload = (event: ProgressEvent) => {
			let result: string | null = (event.target as FileReader).result as string;
			const match = result.match(/<svg[^]+>[^>]+<\/svg>/gm);
			const [svg = '']: any[] = match || [];
			result = svg as string;
			if (cb) cb(result);
			resolve(result);
		};
		reader.readAsText(file);
	});
}