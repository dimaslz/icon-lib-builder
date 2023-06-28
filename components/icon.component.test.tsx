import { render } from '@testing-library/react';

import Icon from './icon.component';

test('should render the component correctly', () => {
	const icon = render(<Icon />);

	expect(icon).toBeTruthy();
});

test('should apply correct size', () => {
	const { container } = render(<Icon width={100} height={100} />);
	const svg = container.getElementsByTagName('svg');
	const style = svg[0].getAttribute('style');

	expect(style).toBe('width: 100px; height: 100px;');
});