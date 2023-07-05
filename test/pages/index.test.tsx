import { render, screen } from '@testing-library/react';
import * as React from 'react';

import Index from '@/pages/index';

vi.mock('@/layouts/SVGEditor.layout', () => ({
	default: () => <div>svg-editor</div>,
}));

vi.mock('@/layouts/ComponentEditorView.layout', () => ({
	default: () => <div>component-editor-view</div>,
}));

vi.mock('react', async () => {
	const actual: typeof React = await vi.importActual('react');

	return {
		...actual,
	};
});

describe('Index', () => {
	afterEach(() => {
		vi.resetAllMocks();
		vi.resetModules();
	});

	test('Loading should be present', async () => {
		const { container } = render(<Index />);

		const style = document.createElement('style');
		style.innerHTML = '.hidden { visibility: hidden; }';
		document.body.appendChild(style);
		document.body.appendChild(container);

		const loadingElm = await screen.queryByTestId('loading');
		expect(loadingElm).toBeInTheDocument();

		expect(await screen.queryByText('svg-editor')).not.toBeVisible();
		expect(await screen.queryByText('component-editor-view')).not.toBeVisible();
	});

	test('Loading should not be present', async () => {
		vi.spyOn(React, 'useState')
			.mockImplementationOnce(() => [true, () => null])
			.mockImplementationOnce(() => [true, () => null]);

		render(<Index />);

		const loadingElm = await screen.queryByTestId('loading');
		expect(loadingElm).not.toBeInTheDocument();

		expect(await screen.queryByText('svg-editor')).toBeVisible();
		expect(await screen.queryByText('component-editor-view')).toBeVisible();
	});
});