export const autoDownload: any = (function () {
	if (!(process as any).browser) return;

	const a: any = document.createElement("a");
	document.body.appendChild(a);
	a.style = "display: none";

	return function (blob: any, filename: string) {
		const url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = filename;
		a.click();
		window.URL.revokeObjectURL(url);
	};
}());

export default autoDownload;