import fs from "fs";
import type { NextApiRequest, NextApiResponse } from 'next';

import compress from '../../../utils/compress';
import svgToFrameworkFormat from '../../../utils/svg-to-framework-format';

type EXT = {
	[key: string]: string;
};

const capitalizeFileName = (filename: string) => {
	return filename
		.replace('.svg', '')
		.replace(
			/(\w)(\w*)/g,
			(g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase())
		.replace(/\s+|\W+/g, '');
};


export default async (httpRequest: NextApiRequest, httpResponse: NextApiResponse) => {
	const uploadPath = `${__dirname}/../../../static/upload`;
	if (!fs.existsSync(uploadPath)) {
		fs.mkdirSync(uploadPath, { recursive: true });
	}

	try {
		const { files, framework }: { files: any[], framework: string } = httpRequest.body;

		const time = `icon-builder-${new Date().getTime()}-${framework}`;

		const ext = ({
			preact: '.tsx',
			react: '.tsx',
			vue: '.vue',
			svelte: '.svelte',
			angular: '.ts',
		} as EXT)[framework];

		fs.mkdirSync(`${uploadPath}/${time}`);
		await Promise.all(
			files.map(async (file: any) => {
				const fileUrl = `${uploadPath}/${time}/${file.name.replace('.svg', ext)}`;
				const iconName = `${capitalizeFileName(file.name)}Icon`;
				const content = svgToFrameworkFormat(file.svg, framework, iconName);
				return fs.writeFileSync(fileUrl, content);
			}),
		);

		const { archive: zip, output } = compress(`${uploadPath}/${time}.zip`);

		zip.directory(`${uploadPath}/${time}`, `${time}`);

		await new Promise(resolve => {
			zip.on('progress', (progress) => {
				if (progress.entries.total === files.length) {
					resolve(true);
				}
			});
		});

		zip.finalize();

		await new Promise(resolve => {
			output.on('close', () => resolve(true));
		});

		fs.rmdirSync(`${uploadPath}/${time}`, {
			recursive: true,
		});
		const stats = fs.statSync(`${uploadPath}/${time}.zip`);

		return httpResponse.status(200).json({
			file: `${time}.zip`,
			size: stats.size,
		});
	} catch (error: any) {
		httpResponse.status(400).send({ message: error.message });
	}
}