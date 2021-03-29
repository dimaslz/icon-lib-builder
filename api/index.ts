import FileToUpload from '../entity-type/FileToUpload.type';

const API_URL = process.env.API_URL;

export class API {
	private static instance: API;

	/**
	 * The API's constructor should always be private to prevent direct
	 * construction calls with the `new` operator.
	 */
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
}

export default API.getInstance();