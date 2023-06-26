import { eventBus } from '@/utils';
import type { EventBusSubscription } from '@/utils/event-bus.utils';

describe('Utils - EventBus', () => {
	const eventBusFooCallback = jest.fn();
	const eventBusFooSubscription: EventBusSubscription = eventBus.subscribe('foo', eventBusFooCallback);

	test('subscribe event', () => {
		eventBus.publish('foo', 'something');

		expect(eventBusFooCallback).toHaveBeenCalledWith('something');
	});

	test('unsubscribe event', () => {
		eventBusFooSubscription.unsubscribe();
		eventBus.publish('foo', 'something');

		expect(eventBusFooCallback).not.toHaveBeenCalled();
	});
});