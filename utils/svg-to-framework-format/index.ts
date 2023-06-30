import prettier from 'prettier';
import { parse } from 'svg-parser';

import { FRAMEWORK_PARSER } from '@/constants';
import type { FrameworkName, LanguageFormat } from '@/entity-type';
import { getTemplate } from '@/templates';
import { formatSvg, svgToReact } from '@/utils';
import cleanSvg from '@/utils/clean-svg';


type StyleOptions = {
	[key: string]: string;
};

export default function svgToFrameworkFormat(
	svg: string,
	framework: FrameworkName,
	iconName: string,
	type?: LanguageFormat,
) {
	if (!svg) return '';

	try {
		const parser: string = FRAMEWORK_PARSER[framework];

		svg = svg
			.replace(/xmls=["'](.*?)["']/gm, '')
			.replace(/xml:space=["'].*?["']/gm, '')
			.replace(/^width=["'].*?["']/gm, '')
			.replace(/^height=["'].*?["']/gm, '');

		const hasStroke = /stroke-width=|stroke=/g.test(svg);
		if (hasStroke) {
			svg = svg.replace(/stroke=["'](?!none).*?["']/gm, 'stroke="currentColor"');
		}
		const svgCleaned = cleanSvg(svg);
		if (!svgCleaned) return null;

		let frameworkFormat: string | null = '';
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

		if (!frameworkFormat) return null;

		if (framework === 'svelte') {

			return prettier.format(
				frameworkFormat.replace(/class="[^"]+"/gm, ''),
				{ parser: 'svelte', plugins: ['prettier-plugin-svelte'] });
		}

		return prettier.format(frameworkFormat.replace(/class="[^"]+"/gm, ''), { parser });
	} catch (error) {
		console.log('[Error]: svg-to-framework', error);

		return '';
	}
}
