import templates from '../templates';
import camelCase from 'lodash.camelcase';
import { parse } from 'svg-parser';

import formatSvg from './parsed-to-svg';

export default (svg: string, type = 'react', iconName?: string) => {
	const svgParsed = parse(svg);

	const toReact = (arr: any[]) => {
		arr.map((child) => {
			const keys = Object.keys(child.properties);
			keys.map((key) => {
				if (/-/.test(key)) {
					if (child.properties[key]) {
						const newKey = camelCase(key);
						child.properties[newKey] = child.properties[key];
						delete child.properties[key];
					}
				}
			});

			if (child.children) {
				return toReact(child.children);
			}

			return child;
		});

		return arr;
	};

	if (svgParsed) {
		const react = toReact(svgParsed.children);
		return (templates as any)[type]
			.replace(/%iconName%/g, iconName)
			.replace(
				/%content%/,
				formatSvg(react, 'style={{ width: `${size}px`, height: `${size}px` }}'),
			);
	}

	return null;
};
