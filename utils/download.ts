export const download = async (fileUrl: string) => {
	const response: any = await fetch(fileUrl);
	const reader = response.body.getReader();
	const contentLength = +response.headers.get('Content-Length');

	let receivedLength = 0;
	const chunks: any[] = [];
	while(true) {
			const { done, value, } = await reader.read();

			if (done) {
					break;
			}

			chunks.push(value);
			receivedLength += value.length;

			console.log(`Received ${receivedLength} of ${contentLength}`);
	}

	return new Blob(chunks);
};

export default download;