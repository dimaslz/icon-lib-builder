import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import SVGEditorLayout from './SVGEditor.layout';

vi.mock('@monaco-editor/react', () => {
	const FakeEditor = vi.fn(props => {
		const onChange = (v) => {
			console.log('ADSD');
			props.onChange(v);
		};

		console.log('props', props.onChange, props.value);
		 return (
    <textarea
	onChange={onChange}
	value={props.value}
    />
  );
},
);
  // return { default: FakeEditor };
  return { default: () => <div /> };
});

describe('SVGEditorLayout', () => {
	test('on drag enter', async () => {
		const onLoad = vi.fn();
		const onChange = vi.fn();
		const svgIcon = '';
		const filesDropped: File[] = [];

		render(<SVGEditorLayout
			onLoad={onLoad}
			onChange={onChange}
			svgIcon={svgIcon}
			filesDropped={filesDropped}
		       />);

		const elm = screen.getByTestId('dropzone');
		const file = new File(
			['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path d="M13,6.81l-5.95,6a2.48,2.48,0,0,1-3.54,0L1.73,11a2.53,2.53,0,0,1,0-3.55L8.07,1.09a2,2,0,0,1,2.84,0l.71.71a2,2,0,0,1,0,2.84L6,10.28a1,1,0,0,1-1.42,0l-.35-.36a1,1,0,0,1,0-1.42L8,4.76" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path></svg>'],
			'dummy.svg',
			{
			type: 'image/svg+xml',
		});

		await fireEvent.dragEnter(elm, { dataTransfer: { items: [file] } });

		expect(screen.getByText('drop file here')).toBeInTheDocument();
	});

	test.todo('drop');
});