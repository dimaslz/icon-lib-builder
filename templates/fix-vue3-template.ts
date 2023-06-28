const fixVue3Template = (
	{ template, stroke, iconName, lang }:
		{ template: string; stroke: boolean; iconName: string; lang?: string; },
) => {
	if (stroke) {
		template = template
			.replace(/%iconName%/g, iconName)
			.replace(/stroke-width=["'].*?["']/, ':stroke-width="stroke"')
			.replace(/:style=["']{(.*?)}["']/gm, ':style="{$1, strokeWidth: `${stroke}`}"')
			.replace('%props%', lang !== 'compressed' ? `props: {
	size: {
		type: [Number, String],
		default: 24,
	},
	stroke: {
		type: [Number, String],
		default: 1,
	},
}` : `defineProps<{ size: number | string, stroke: number | string }>();`);
	} else {
		template = template
			.replace('%props%', lang !== 'compressed' ? `	props: {
	size: {
		type: [Number, String],
		default: 24,
	},
}` : `defineProps<{ size: number | string }>();`);
	}

	return template;
};

export default fixVue3Template;
