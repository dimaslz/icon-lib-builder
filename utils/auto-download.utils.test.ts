import autoDownload from './auto-download.utils';

describe('auto download', () => {
	const blobUrl = 'blob:http://url.test/fa3d222e-c21d-4a06-8194-199069e8ad0e';

	describe('should create link in dom', () => {
		const filename = 'filename.zip';
		const mBlob = { size: 1024, type: 'application/zip' };
		let anchor: HTMLAnchorElement | null;

		beforeEach(() => {
			global.URL.createObjectURL = vi.fn(() => blobUrl);
			global.URL.revokeObjectURL = vi.fn();
			const blobSpy = vi
				.spyOn(global, 'Blob')
				.mockImplementationOnce((): any => mBlob);
			vi.spyOn(document.body, 'appendChild');

			autoDownload(blobSpy, filename);
			anchor = global.document.querySelector('a');
		});

		test('url should be created', () => {
			expect(global.URL.createObjectURL).toBeCalled();
		});

		test('url should be revoked', () => {
			expect(global.URL.revokeObjectURL).toBeCalled();
		});

		test('anchor should be created', () => {
			expect(anchor).toBeTruthy();
		});

		test(`download name should be ${filename}`, () => {
			expect(anchor?.getAttribute('download')?.toString()).toBe(filename);
		});

		test(`href should be ${blobUrl}`, () => {
			expect(anchor?.getAttribute('href')).toBe(blobUrl);
		});
	});
});
