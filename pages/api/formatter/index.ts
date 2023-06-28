import type { NextApiRequest, NextApiResponse } from 'next';
import prettier from 'prettier';

import cleanSvg from '../../../utils/clean-svg';
import svgToFrameworkFormat from '../../../utils/svg-to-framework-format';

export default (httpRequest: NextApiRequest, httpResponse: NextApiResponse) => {
	const { script, framework, iconName = 'Icon', type } = httpRequest.body;

	if (framework === 'svg') {
		const { data: svgCleaned } = cleanSvg(script) as any;
		if (!svgCleaned) return httpResponse.status(400).json({});

		const code = prettier
			.format(svgCleaned, { parser: 'babel' });

		return httpResponse.status(200).json(code);
	}

	const svgFrameworkCode = svgToFrameworkFormat(script, framework, iconName, type);

	httpResponse.statusCode = 200;
	return httpResponse.json(svgFrameworkCode);
};