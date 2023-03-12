import fs from "fs";
import type { NextApiRequest, NextApiResponse } from 'next';

export default (httpRequest: NextApiRequest, httpResponse: NextApiResponse) => {
	const filename = httpRequest.query.file;

	const uploadPath = `${__dirname}/../../../static/upload`;
	const fileUrl = `${uploadPath}/${filename}`;
	const stats = fs.statSync(fileUrl);

	httpResponse.setHeader('Content-Length', stats.size);
	return (httpResponse as any).download(fileUrl, () => {
		console.log("DONE");
		fs.rmSync(fileUrl);
	});

}