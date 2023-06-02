import path from "path";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from 'next';


export default (httpRequest: NextApiRequest, httpResponse: NextApiResponse) => {
	const filename = httpRequest.query.file;

	const uploadPath = path.join('./public', 'uploads');
	const fileUrl = `${uploadPath}/${filename}`;
	const stats = fs.statSync(fileUrl);
	const imageBuffer = fs.readFileSync(fileUrl)

	fs.rmSync(fileUrl);

	httpResponse.setHeader('Content-Length', stats.size);
	httpResponse.send(imageBuffer)
}