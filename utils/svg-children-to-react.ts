import camelCase from 'lodash/camelCase';

const svgChildrenToReact = (arr: any[]) => {
	arr.map(child => {
		const keys = Object.keys(child.properties);
		keys.map(key => {
			if (/-/.test(key)) {
				if (child.properties[key]) {
					const newKey = camelCase(key);
					child.properties[newKey] = child.properties[key];
					delete child.properties[key];
				}
			}
		});

		if (child.children) {
			return svgChildrenToReact(child.children);
		}

		return child;
	});

	return arr;
};

export default svgChildrenToReact;