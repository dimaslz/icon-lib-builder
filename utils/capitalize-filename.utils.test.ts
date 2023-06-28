import capitalizeFilename from './capitalize-filename.utils';

describe('Utils - capitalizeFileName', () => {
	test('capitalize filename', () => {
		const filename = 'my-file-name.js';

		expect(capitalizeFilename(filename)).toBe('MyFileNameJs');
	});
});