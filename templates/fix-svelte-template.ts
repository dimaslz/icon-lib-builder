const fixSvelteTemplate = (
	{ template, stroke, lang }:
		{ template: string; stroke: boolean; lang?: string; },
) => {
	if (stroke) {
		template = template
			.replace(/stroke-width=["'].*?["']/, 'stroke-width={stroke}')
			.replace(/style={[^]+}/gm, 'style={`width: ${size}px; height: ${size}px; stroke-width=${stroke};`}')
			.replace('%props%', lang === 'js'
				? `export let size = 24;
	export let stroke = 1;`
				: `export let size: string | number = 24;
	export let stroke: string | number = 1;`);
	} else {
		template = template
			.replace(/style={[^]+}/gm, 'style={`width: ${size}px; height: ${size}px; `}')
			.replace('%props%', lang === 'js' ? `export let size = 24;` : `export let size: string | number = 24;`);
	}

	return template;
};

export default fixSvelteTemplate;