import Observable, { ObservableSubscription } from './observable.util';

describe('Utils - Observable', () => {
	const observable = Observable<{ value: string; }>({ value: '' });
	const observableCallback = vi.fn();
	let subscription$: ObservableSubscription;

	test('on subscribed', () => {
		subscription$ = observable.subscribe(observableCallback);
		observable.set({ value: 'foo' });

		expect(observableCallback).toHaveBeenCalledTimes(1);
		expect(observableCallback).toHaveBeenNthCalledWith(1, { value: 'foo' });
	});

	test('on unsubscribed', () => {
		subscription$.unsubscribe();
		observable.set({ value: 'bar' });

		expect(observableCallback).not.toHaveBeenNthCalledWith(2);
	});
});
