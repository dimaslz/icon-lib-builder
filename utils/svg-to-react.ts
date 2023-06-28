import camelCase from 'lodash/camelCase';
import { parse } from 'svg-parser';

import { type Framework, getTemplate, type Lang } from '@/templates';

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

export default (
	svg: string,
	framework: Framework = 'react',
	type: Lang = 'js-v1',
	iconName?: string,
): string | null => {
	try {
		const hasStroke = /stroke-width=|stroke=/.test(svg);

		const svgParsed = parse(svg);

		if (svgParsed) {
			// svgParsed.children[0].properties.className = '%className%';
			const react = toReact(svgParsed.children);

			const style = hasStroke
				? 'width: `${size}px`, height: `${size}px`, strokeWidth: `${stroke}px`, ...style'
				: 'width: `${size}px`, height: `${size}px`, ...style';

			const template = getTemplate({
				framework,
				lang: type,
				content: formatSvg(react, style, framework),
				stroke: hasStroke,
			});

			return template
				.replace(/strokeWidth=["'].*?["']/gm, 'strokeWidth={{stroke}}')
				.replace(
					/%iconName%/g,
					iconName,
				);
		}
	} catch (error: any) {
		console.error(error.message);
	}

	return null;
};