import { optimize } from 'svgo';

// const plugins: Plugin[] = [
// 	'removeDoctype',
// 	'removeXMLProcInst',
// 	'removeComments',
// 	'removeMetadata',
// 	'removeEditorsNSData',
// 	'cleanupAttrs',
// 	'inlineStyles',
// 	'minifyStyles',
// 	'cleanupIDs',
// 	'removeUselessDefs',
// 	'cleanupNumericValues',
// 	'convertColors',
// 	'removeUnknownsAndDefaults',
// 	'removeNonInheritableGroupAttrs',
// 	'removeUselessStrokeAndFill',
// 	'removeViewBox',
// 	'cleanupEnableBackground',
// 	'removeHiddenElems',
// 	'removeEmptyText',
// 	'convertShapeToPath',
// 	'convertEllipseToCircle',
// 	'moveElemsAttrsToGroup',
// 	'moveGroupAttrsToElems',
// 	'collapseGroups',
// 	'convertPathData',
// 	'convertTransform',
// 	'removeEmptyAttrs',
// 	'removeEmptyContainers',
// 	'mergePaths',
// 	'removeUnusedNS',
// 	'sortDefsChildren',
// 	'removeTitle',
// 	'removeDesc',
// ];

export default function clean(svg: any) {
	// const cleaner = new Svgo({
	//   full: true,
	//   plugins: [...PLUGINS, { cleanupIDs: cleanupIDs && { minify: false } }],
	// });

	try {
		const cleaned = optimize(svg, {
			// full: true,
			// plugins,
			// plugins: [
			// 	...PLUGINS, { cleanupIDs: true && { minify: false } }
			// ],
		});
		return cleaned;
	} catch (error) {
		return error;
	}
}