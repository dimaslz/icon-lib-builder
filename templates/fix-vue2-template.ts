const fixVue2Template = (
	{ template, stroke, iconName }:
		{ template: string; stroke: boolean; iconName: string; },
) => {
	if (stroke) {
		template = template
			.replace(/%iconName%/g, iconName)
			.replace(/stroke-width=["'].*?["']/, ':stroke-width="stroke"')
			.replace(/:style=["']{(.*?)}["']/gm, ':style="{$1, strokeWidth: `${stroke}`}"')
			.replace('%props%', `props: {
	size: {
		type: [Number, String],
		default: 24
	},
	stroke: {
		type: [Number, String],
		default: 1
	},
},`);
	} else {
		template = template
			.replace('%props%', `props: {
	size: {
		type: [Number, String],
		default: 24
	},
},`);
	}

	return template;
};

export default fixVue2Template;
