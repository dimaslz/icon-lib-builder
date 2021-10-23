export const formatSvg = (arr: any[], svgStyle?: string): string => {
	const toSvg = arr.map((child) => {
		if (child.type === 'element') {
			const svgContent = [];
			if (child.children) {
				svgContent.push(formatSvg(child.children));
			}

			let properties = ``;
			Object.entries(child.properties).forEach(([key, value]) => {
				properties += ` ${key}="${value}"`;
			});
			if (child.tagName === 'svg' && svgStyle) {
				properties += ` ${svgStyle}`;
			}
			const element = `<${child.tagName}${properties}>${svgContent.join('')}</${
				child.tagName
			}>`;

			return element;
		}
	});

	return toSvg.join('').replace(/\\"/g, '"');
};

export default formatSvg;
