import _ from 'lodash';
import prettier from 'prettier';
import { parse } from 'svg-parser';

import templates, { getTemplate, type Framework, type Lang } from '../../templates';
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
	framework: Framework,
	iconName: string,
	type?: Lang,
) {
	if (!svg) return '';

	try {
		const parserOptions: ParserFW = {
			preact: 'babel',
			react: 'babel',
			svg: 'babel',
			vue2: 'vue',
			vue3: 'vue',
			svelte: 'babel',
			angular: 'babel',
		};
		const parser: string = parserOptions[framework];

		svg = svg
			.replace(/xmls=["'](.*?)["']/gm, '')
			.replace(/xml:space=["'].*?["']/gm, '')
			.replace(/^width=["'].*?["']/gm, '')
			.replace(/^height=["'].*?["']/gm, '');

		const hasStroke = /stroke-width/g.test(svg);
		if (hasStroke) {
			svg = svg.replace(/stroke=["'](?!none).*?["']/gm, 'stroke="currentColor"');
		}
		const { data: svgCleaned } = cleanSvg(svg) as { data: any };
		let frameworkFormat = '';
		if (/p?react/.test(framework)) {
			frameworkFormat = svgToReact(svg, framework, type, iconName);
		} else if (framework) {
			const styleOptions: StyleOptions = {
				vue2: ' :style="{ width: `${size}px`, height: `${size}px` }"',
				vue3: ' :style="{ width: `${size}px`, height: `${size}px` }"',
				svelte: ' style={`width: ${size}px; height: ${size}px;`}',
				angular: ' style="width: {{size}}px; height: {{size}}px; color: {{color}}; {{style}}"',
			};
			const style: string = styleOptions[framework];
			const svgParsed = parse(svgCleaned);
			const svgFormat: string = formatSvg(svgParsed.children, style, framework);

			frameworkFormat = getTemplate({
				framework,
				lang: framework === 'angular' ? undefined : type,
				content: svgFormat,
				stroke: hasStroke,
				iconName,
			});
		}

		if (framework === 'svelte') {
			return prettier.format(
				frameworkFormat.replace(/class="[^\"]+"/gm, ''),
				{ parser: 'svelte', plugins: ['prettier-plugin-svelte'] });
		}

		return prettier.format(frameworkFormat.replace(/class="[^\"]+"/gm, ''), { parser });
	} catch (error) {
		console.log('[Error]: svg-to-framework', error);
		return '';
	}
}
