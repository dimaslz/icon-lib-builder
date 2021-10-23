import kebabCase from 'lodash/kebabCase';
import prettier from 'prettier';
import { parse } from 'svg-parser';

import templates from '../../templates';
import cleanSvg from '../clean-svg';
import formatSvg from '../parsed-to-svg';
import svgToReact from '../svg-to-react';

type ParserFW = {
	[key: string]: string;
};

type StyleOptions = {
	[key: string]: string;
};

export const svgToFrameworkFormat = (
	svg: string,
	framework: string,
	iconName?: string,
): string => {
	const parserOptions: ParserFW = {
		preact: 'babel',
		react: 'babel',
		svg: 'babel',
		vue: 'vue',
		angular: 'babel',
	};
	const parser: string = parserOptions[framework];

	const { data: svgCleaned } = cleanSvg(svg);
	let frameworkFormat = '';
	if (/p?react/.test(framework)) {
		frameworkFormat = svgToReact(svg, framework, iconName);
	} else if (framework) {
		const styleOptions: StyleOptions = {
			vue: ':style="{ width: `${size}px`, height: size }"',
			angular: '[style]="style"',
		};
		const style: string = styleOptions[framework];
		const svgParsed = parse(svgCleaned);
		const svgFormat: string = formatSvg(svgParsed.children, style);
		frameworkFormat = (templates as any)[framework].replace(
			/%content%/,
			svgFormat,
		);

		if (framework === 'angular') {
			frameworkFormat = frameworkFormat
				.replace(/%iconName%/g, kebabCase(iconName))
				.replace(/%classIconName%/g, iconName);
		} else {
			frameworkFormat = frameworkFormat.replace(/%iconName%/g, iconName);
		}
	}

	return prettier.format(frameworkFormat.replace(/class="[^"]+"/gm, ''), {
		parser,
	});
};

export default svgToFrameworkFormat;
