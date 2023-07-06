import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FRAMEWORK_CONFIG } from '@/constants';

import FrameworkButtonList from './framework-button-list.component';

describe('Framework button list', () => {
	describe('react framework is selected', () => {
		const onClick: () => void = vi.fn();
		let button: HTMLElement;

		beforeEach(() => {
			render(<FrameworkButtonList
				frameworks={FRAMEWORK_CONFIG}
				onClick={onClick}
				selected={'react'}
			       />);

			button = screen.getByRole(
				'tab',
				{ name: /^react framework/i, selected: true },
			);
		});

		test('framework is selected', async () => {
			expect(button).toBeVisible();
		});

		test('onClick event works', async () => {
			await userEvent.click(button);

			expect(onClick).toBeCalled();
		});
	});

	describe('preact framework is selected', () => {
		const onClick: () => void = vi.fn();
		let button: HTMLElement;

		beforeEach(() => {
			render(<FrameworkButtonList
				frameworks={FRAMEWORK_CONFIG}
				onClick={onClick}
				selected={'preact'}
			       />);

			button = screen.getByRole(
				'tab',
				{ name: /^preact framework/i, selected: true },
			);
		});

		test('framework is selected', async () => {
			expect(button).toBeVisible();
		});

		test('onClick event works', async () => {
			await userEvent.click(button);

			expect(onClick).toBeCalled();
		});
	});

	describe('vue2 framework is selected', () => {
		const onClick: () => void = vi.fn();
		let button: HTMLElement;

		beforeEach(() => {
			render(<FrameworkButtonList
				frameworks={FRAMEWORK_CONFIG}
				onClick={onClick}
				selected={'vue2'}
			       />);

			button = screen.getByRole(
				'tab',
				{ name: /^vue 2 framework/i, selected: true },
			);
		});

		test('framework is selected', async () => {
			expect(button).toBeVisible();
		});

		test('onClick event works', async () => {
			await userEvent.click(button);

			expect(onClick).toBeCalled();
		});
	});

	describe('vue3 framework is selected', () => {
		const onClick: () => void = vi.fn();
		let button: HTMLElement;

		beforeEach(() => {
			render(<FrameworkButtonList
				frameworks={FRAMEWORK_CONFIG}
				onClick={onClick}
				selected={'vue3'}
			       />);

			button = screen.getByRole(
				'tab',
				{ name: /^vue 3 framework/i, selected: true },
			);
		});

		test('framework is selected', async () => {
			expect(button).toBeVisible();
		});

		test('onClick event works', async () => {
			await userEvent.click(button);

			expect(onClick).toBeCalled();
		});
	});

	describe('svelte framework is selected', () => {
		const onClick: () => void = vi.fn();
		let button: HTMLElement;

		beforeEach(() => {
			render(<FrameworkButtonList
				frameworks={FRAMEWORK_CONFIG}
				onClick={onClick}
				selected={'svelte'}
			       />);

			button = screen.getByRole(
				'tab',
				{ name: /^svelte framework/i, selected: true },
			);
		});

		test('framework is selected', async () => {
			expect(button).toBeVisible();
		});

		test('onClick event works', async () => {
			await userEvent.click(button);

			expect(onClick).toBeCalled();
		});
	});

	describe('angular framework is selected', () => {
		const onClick: () => void = vi.fn();
		let button: HTMLElement;

		beforeEach(() => {
			render(<FrameworkButtonList
				frameworks={FRAMEWORK_CONFIG}
				onClick={onClick}
				selected={'angular'}
			       />);

			button = screen.getByRole(
				'tab',
				{ name: /^angular framework/i, selected: true },
			);
		});

		test('framework is selected', async () => {
			expect(button).toBeVisible();
		});

		test('onClick event works', async () => {
			await userEvent.click(button);

			expect(onClick).toBeCalled();
		});
	});
});