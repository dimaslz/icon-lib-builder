import { fireEvent, render, screen } from '@testing-library/react';

import DropZone from './drop-zone.component';

describe('DropZone', () => {
	test('on dragenter', async () => {
		const onDrop = vi.fn();
		render(<DropZone onDrop={onDrop}>
			<div>my content</div>
		</DropZone>);

		const elm = screen.getByTestId('dropzone');
		const file = new File(['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path d="M13,6.81l-5.95,6a2.48,2.48,0,0,1-3.54,0L1.73,11a2.53,2.53,0,0,1,0-3.55L8.07,1.09a2,2,0,0,1,2.84,0l.71.71a2,2,0,0,1,0,2.84L6,10.28a1,1,0,0,1-1.42,0l-.35-.36a1,1,0,0,1,0-1.42L8,4.76" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path></svg>'], 'dummy.svg', {
			type: 'image/svg+xml',
		});

		await fireEvent.dragEnter(elm, { dataTransfer: { items: [file] } });

		expect(screen.getByText('drop file here')).toBeInTheDocument();
		expect(onDrop).not.toBeCalled();
	});

	test('on drop', async () => {
		const onDrop = vi.fn();
		render(<DropZone onDrop={onDrop}>
			<div>my content</div>
		</DropZone>);

		const elm = screen.getByTestId('dropzone');
		const file = new File(['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path d="M13,6.81l-5.95,6a2.48,2.48,0,0,1-3.54,0L1.73,11a2.53,2.53,0,0,1,0-3.55L8.07,1.09a2,2,0,0,1,2.84,0l.71.71a2,2,0,0,1,0,2.84L6,10.28a1,1,0,0,1-1.42,0l-.35-.36a1,1,0,0,1,0-1.42L8,4.76" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path></svg>'], 'dummy.svg', {
			type: 'image/svg+xml',
		});

		await fireEvent.drop(elm, { dataTransfer: { files: [file] } });

		expect(onDrop).toBeCalledWith(new Event('drop'), [file]);
	});
});