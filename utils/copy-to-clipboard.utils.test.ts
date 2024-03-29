import copyToClipboard from './copy-to-clipboard.utils';

describe('Utils - CopyToClipboard', () => {
	test('should excecute copy command', () => {
		document.execCommand = vi.fn();
		copyToClipboard('my content text');

		expect(document.execCommand).toHaveBeenCalledWith('copy');
	});
});
