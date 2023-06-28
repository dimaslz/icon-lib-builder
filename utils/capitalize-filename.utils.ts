const capitalizeFilename = (filename: string) => filename
	.replace('.svg', '')
	.replace(
		/(\w)(\w*)/g,
		(g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase())
	.replace(/\s+|\W+/g, '');

export default capitalizeFilename;
