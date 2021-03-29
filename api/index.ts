import FileToUpload from '../entity-type/FileToUpload.type';
import { downloadUrl } from '../utils';

const API_URL = process.env.API_URL;

export class API {
	private static instance: API;

	private constructor() { }

	public static getInstance(): API {
        if (!API.instance) {
            API.instance = new API();
        }

        return API.instance;
	}

	public uploadFiles(files: FileToUpload[], framework: string) {
        return fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                files,
                framework,
            }),
        }).then(response => response.json());
	}

	public formatter(script: string, framework: string): Promise<string> {
        return fetch(`${API_URL}/formatter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            script,
            framework,
        }),
        }).then(i => i.json())
        .then(({ code }) => code);
    }

    public downloadFilename(filename: string) {
        const url = `${API_URL}/download/${filename}`;
        return downloadUrl(url);
    }
}

export default API.getInstance();