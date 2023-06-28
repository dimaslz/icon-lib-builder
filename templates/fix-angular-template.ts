import kebabCase from 'lodash/kebabCase';

const fixAngularTemplate = (
	{ template, stroke, iconName }:
		{ template: string; stroke: boolean; iconName: string; },
) => {
	template = template
		.replace(/%iconName%/g, kebabCase(iconName))
		.replace(/%classIconName%/g, iconName);

	if (stroke) {
		template = template
			.replace(/stroke-width=["'].*?["']/, '')
			.replace(/style=["']([^"']+)["']/gm, 'style="$1 stroke-width: {{ stroke }}"')
			.replace(/%props%/g, `@Input() style: string = "";
		@Input() size: number | string = 24;
		@Input() stroke: number | string = 24;
		@Input() color: string = "";`);
	} else {
		template = template
			.replace(/style={[^]+}/gm, 'style={`width: ${size}px; height: ${size}px;')
			.replace('%props%', `@Input() style: string = "";
@Input() size: number | string = 24;
@Input() color: string = "";`);
	}

	return template;
};

export default fixAngularTemplate;