import templates from '../templates';
import camelCase from 'lodash/camelCase';
import { parse } from 'svg-parser';

import formatSvg from './parsed-to-svg';

const toReact = (arr: any[]) => {
	arr.map(child => {
		const keys = Object.keys(child.properties);
		keys.map(key => {
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

export default (svg: string, framework = 'react', type = 'js', iconName?: string): any => {
	try {
		const hasStroke = /stroke-width/.test(svg);

		svg = svg.replace(/stroke-width=["'].*?["']/gm, '');

		const svgParsed = parse(svg);

		if (svgParsed) {
			const react = toReact(svgParsed.children);
			const template = type && typeof (templates as any)[framework] !== 'string'
				? (templates as any)[framework][type]
				: (templates as any)[framework];


			const style = hasStroke
				? 'width: `${size}px`, height: `${size}px`, strokeWidth: `${stroke}px`, ...style'
				: 'width: `${size}px`, height: `${size}px`, ...style';
			return template
				.replace(
					/%iconName%/g,
					iconName,
				)
				.replace(
					/%content%/,
					formatSvg(react, style, framework),
				);
		};

		return null;
	} catch (error: any) {
		console.error(error.message);
	}
};