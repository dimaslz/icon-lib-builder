const fixPReactTemplate = ({ template, stroke }: { template: string; stroke: boolean; }) => {
	if (stroke) {
		template = template.replace('%type%', `type PROPS = {
	size?: number | string;
	stroke?: number | string;
	style?: React.CSSProperties;
	className?: string | undefined;
}`);
		template = template
			.replace('<svg', '<svg\nclassName={className}')
			.replace('%props%', '{ size = 24, stroke = 1, style = {}, className }');
	} else {
		template = template.replace('%props%', '{ size = 24, style = {}, className }');
		template = template.replace('%type%', `type PROPS = {
	size?: number | string;
	style?: React.CSSProperties;
	className?: string | undefined;
}`);
	}

	return template
		.replace(/stroke-linecap=["'](.*?)["']/gm, "strokeLinecap='$1'")
		.replace(/stroke-linejoin=["'](.*?)["']/gm, "strokeLinejoin='$1'")
		.replace('"%className%"', '{className}');
};

export default fixPReactTemplate;