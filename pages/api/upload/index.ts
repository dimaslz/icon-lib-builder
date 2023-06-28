import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from 'next';

import compress from '@/utils/compress';
import svgToFrameworkFormat from '@/utils/svg-to-framework-format';
import { capitalizeFilename } from "@/utils";
import { EXTENSION_MAP } from "@/constants";
import { FrameworkName, LanguageFormat } from "@/entity-type";


export default async (httpRequest: NextApiRequest, httpResponse: NextApiResponse) => {
	const uploadPath = path.join('./public', 'uploads');
	if (!fs.existsSync(uploadPath)) {
		fs.mkdirSync(uploadPath, { recursive: true });
	}

	try {
		const { files, framework, language }:
			{ files: any[], framework: FrameworkName, language: LanguageFormat } = httpRequest.body;

		const time = `icon-builder-${new Date().getTime()}-${framework}`;

		let ext = EXTENSION_MAP[framework];

		if (typeof ext === "object") {
			ext = ext[language];
		}

		fs.mkdirSync(`${uploadPath}/${time}`);
		await Promise.all(
			files.map(async (file: any) => {
				const fileUrl = `${uploadPath}/${time}/${capitalizeFilename(file.name)}Icon${ext}`;
				const iconName = `${capitalizeFilename(file.name)}Icon`;
				const content = svgToFrameworkFormat(file.svg, framework, iconName, language); // TODO: type!!
				if (!content) return "";

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