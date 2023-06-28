import camelCase from 'lodash/camelCase';

export default function formatSvg(arr: any[], svgStyle?: string, framework?: string) {
	const toSvg: any[] = arr.map(child => {
		if (child.type === 'element') {
			const svgContent = [];
			if (child.children) {
				svgContent.push(formatSvg(child.children, svgStyle, framework));
			}

			let properties = ``;
			Object.entries(child.properties).forEach(([key, value]) => {
				if (framework === 'react' && key === 'style') {
					const styleReact = (value as string).split(';').map(i => {
						const a = i.split(':');
						a[0] = camelCase(a[0]);
						a[1] = `"${a[1]}"`;
						return a.join(':');
					}).join(',');

					properties += ` ${key}={{${styleReact}}}`;
				} else {
					properties += ` ${key}="${value}"`;
				}

			});

			if (child.tagName === 'svg' && svgStyle) {
				if (/style=\{\{[^}]+\}\}/gm.test(properties)) {
					properties = properties.replace(/(style=\{\{[^}]+)\}\}/gm, `$1, ${svgStyle}}}`);
				} else if (framework && ['vue2', 'vue3', 'angular', 'svelte'].includes(framework)) {
					properties += `${svgStyle}`;
				} else {
					properties += `style={{${svgStyle}}}`;
				}
			}

			const element = `<${child.tagName}${properties}>${svgContent.join('')}</${child.tagName}>`;

			return element;
		}


	});

	return toSvg.join('').replace(/\\"/g, '"');
}