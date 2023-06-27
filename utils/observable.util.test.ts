import Observable, { ObservableSubscription } from './observable.util';

describe('Utils - Observable', () => {
	const observable = Observable<{ value: string; }>({ value: '' });
	const observableCallback = jest.fn();
	let subscription$: ObservableSubscription;

	test('on subscribed', () => {
		subscription$ = observable.subscribe(observableCallback);
		observable.set({ value: 'foo' });

		expect(observableCallback).toHaveBeenCalledWith({ value: 'foo' });
	});

	test('on unsubscribed', () => {
		subscription$.unsubscribe();
		observable.set({ value: 'foo' });

		expect(observableCallback).not.toHaveBeenCalled();
	});
});
