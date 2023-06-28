import readFile from './read-file.utils';

describe('Utils - Read file', () => {
	test('should return the file content', async () => {
		const mFile = new File(['filename'], 'filename.zip');

		const fileContent = await readFile(mFile);
		expect(fileContent).toBe('filename');
	});

	test('if the file has not content, should return error', async () => {
		const mFile = new File([], 'filename.zip');

		const fileContent = await readFile(mFile)
			.catch(err => err);

		expect(fileContent).toBe('No file content');
	});
});