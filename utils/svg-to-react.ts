import { parse } from 'svg-parser';

import { FrameworkName, LanguageFormat } from '@/entity-type';
import { getTemplate } from '@/templates';
import svgChildrenToReact from '@/utils/svg-children-to-react';

import formatSvg from './parsed-to-svg';


const svgToReact = (
	svg: string,
	framework: FrameworkName = 'react',
	type: LanguageFormat = 'js-v1',
	iconName = 'Icon',
): string | null => {
	try {
		const hasStroke = /stroke-width=|stroke=/.test(svg);

		const svgParsed = parse(svg);

		if (svgParsed) {
			const react = svgChildrenToReact(svgParsed.children);

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

export default svgToReact;
