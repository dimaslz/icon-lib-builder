import { eventBus } from '@/utils';
import type { EventBusSubscription } from '@/utils/event-bus.utils';

describe('Utils - EventBus', () => {
	const eventBusFooCallback = vi.fn();
	let eventBusFooSubscription: EventBusSubscription;
	beforeAll(() => {
		eventBusFooSubscription = eventBus.subscribe('foo', eventBusFooCallback);
	});

	test('subscribe event', () => {
		eventBus.publish('foo', 'something');

		expect(eventBusFooCallback).toHaveBeenCalledTimes(1);
		expect(eventBusFooCallback).toHaveBeenNthCalledWith(1, 'something');
	});

	test('unsubscribe event', () => {
		eventBusFooSubscription.unsubscribe();
		eventBus.publish('foo', 'other');

		expect(eventBusFooCallback).not.toHaveBeenNthCalledWith(2);
	});
});