import FileToUpload from '../entity-type/FileToUpload.type';
import { downloadUrl } from '../utils';

export class API {
    private static instance: API;

    private constructor() { }

    public static getInstance(): API {
        if (!API.instance) {
            API.instance = new API();
        }

        return API.instance;
    }

    public uploadFiles(files: FileToUpload[], framework: string, language: string) {
        return fetch(`/api/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                files,
                framework,
                language,
            }),
        }).then((result: any): any => {
            const { ok } = result;
            if (!ok) throw new Error("Failing upload files");

            return result;
        }).then(response => {
            return response.json();
        })
            .catch(this.errorHandler);
    }

    public formatter({
        script,
        framework,
        iconName,
        type,
    }: {
        script: string,
        framework: string,
        iconName?: string,
        type?: string
    }): Promise<string> {
        return fetch(`/api/formatter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                script,
                framework,
                iconName,
                type,
            }),
        }).then((result: any): any => {
            const { ok } = result;
            if (!ok) throw new Error("File not valid");

            return result;
        })
            .then(result => result.json())
            .catch(this.errorHandler);
    }

    public downloadFilename(filename: string) {
        const url = `/api/download/${filename}`;
        return downloadUrl(url);
    }

    private errorHandler(error: Error) {
        console.log("error", error);
        throw new Error(error.message);
    }
}

export default API.getInstance();