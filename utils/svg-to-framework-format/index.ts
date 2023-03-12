import _ from 'lodash';
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

export default function svgToFrameworkFormat(
	svg: string,
	framework: string,
	iconName?: string,
	type?: string,
) {
	try {
		const parserOptions: ParserFW = {
			preact: 'babel',
			react: 'babel',
			svg: 'babel',
			vue2: 'vue',
			vue3: 'vue',
			angular: 'babel',
		};
		const parser: string = parserOptions[framework];

		svg = svg
			// .replace(/^style=["'].*?["']/gm, "");
			// .replace(/stroke-width=["'].*?["']/gm, "")
			.replace(/xml:space=["'].*?["']/gm, '')
			.replace(/^width=["'].*?["']/gm, '')
			.replace(/^height=["'].*?["']/gm, '');
		// .replace(/stroke=["'](?!none).*?["']/gm, "stroke=\"currentColor\"")
		// .replace(/fill=["'](?!none).*?["']/gm, "fill=\"currentColor\"");

		const { data: svgCleaned } = cleanSvg(svg);
		let frameworkFormat = '';
		if (/p?react/.test(framework)) {
			frameworkFormat = svgToReact(svg, framework, type, iconName);
		} else if (framework) {
			const styleOptions: StyleOptions = {
				vue2: ':style="{ width: `${size}px`, height: `${size}px` }"',
				vue3: ':style="{ width: `${size}px`, height: `${size}px` }"',
				angular: 'style="width: {{size}}px; height: {{size}}px; color: {{color}};{{style}}"',
			};
			const style: string = styleOptions[framework];
			const svgParsed = parse(svgCleaned);
			const svgFormat: string = formatSvg(svgParsed.children, style, framework);

			if (type) {
				frameworkFormat = (templates as any)[framework][type]
					.replace(/%content%/, svgFormat);
			} else {
				frameworkFormat = (templates as any)[framework]
					.replace(/%content%/, svgFormat);
			}

			if (framework === 'angular') {
				frameworkFormat = frameworkFormat
					.replace(/%iconName%/g, _.kebabCase(iconName))
					.replace(/%classIconName%/g, iconName);
			} else {
				frameworkFormat = frameworkFormat.replace(/%iconName%/g, iconName);
			}
		}

		return prettier.format(frameworkFormat.replace(/class="[^\"]+"/gm, ''), { parser });
	} catch (error) {
		return '';
	}
}
