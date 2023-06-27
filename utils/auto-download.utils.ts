const isBrowser = typeof window !== 'undefined';

export const autoDownload: any = (function () {
	if (!isBrowser) return;

	const a: HTMLAnchorElement = document.createElement('a');
	a.style.display = 'none';
	document.body.appendChild(a);

	return function (blob: Blob, filename: string) {
		const url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = filename;
		a.click();
		window.URL.revokeObjectURL(url);
	};
}());

export default autoDownload;