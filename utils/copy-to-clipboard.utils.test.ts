import copyToClipboard from './copy-to-clipboard.utils';

describe('CopyToClipboard', () => {
	test('should excecute copy command', () => {
		document.execCommand = jest.fn();
		copyToClipboard('my content text');

		expect(document.execCommand).toHaveBeenCalledWith('copy');
	});
});