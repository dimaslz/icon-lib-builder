import type { NextApiRequest, NextApiResponse } from 'next';
import prettier from 'prettier';

import cleanSvg from '@/utils/clean-svg';
import svgToFrameworkFormat from '@/utils/svg-to-framework-format';

export default (httpRequest: NextApiRequest, httpResponse: NextApiResponse) => {
	const { script, framework, iconName = 'Icon', type } = httpRequest.body;

	if (framework === 'svg') {
		const svgCleaned = cleanSvg(script);

		httpResponse.statusCode = 400;
		if (!svgCleaned) return httpResponse.json({});

		const code = prettier
			.format(svgCleaned, { parser: 'babel' });

		httpResponse.statusCode = 200;
		return httpResponse.json(code);
	}

	const svgFrameworkCode = svgToFrameworkFormat(script, framework, iconName, type);

	httpResponse.statusCode = 200;
	return httpResponse.json(svgFrameworkCode);
};