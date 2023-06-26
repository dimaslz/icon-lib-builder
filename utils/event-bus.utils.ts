export type Subscription = {
	[key: string]: any;
}

export type EventBusSubscription = {
	unsubscribe: () => void;
}

export type EventBus<EventType, Callback, UnSub> = {
	subscribe: (eventType: EventType, callback: Callback) => UnSub
	publish: (eventType: EventType, arg?: any) => void
}


const getNextUniqueId = () => new Date().getTime();

const subscriptions: Subscription = {};
export const eventBus = {
	subscribe: <T>(eventType: string, callback: (data: T) => void): EventBusSubscription => {
		const id = getNextUniqueId();

		if (!subscriptions[eventType]) {
			subscriptions[eventType] = {};
		}

		subscriptions[eventType][id] = callback;
		return {
			unsubscribe: () => {
				delete subscriptions[eventType][id];
				if (Object.keys(subscriptions[eventType]).length === 0) {
					delete subscriptions[eventType];
				}
			},
		};
	},

	publish: <T>(eventType: string, arg?: T) => {
		if (!subscriptions[eventType]) {
			return;
		}

		Object.keys(subscriptions[eventType]).forEach((id) =>
			subscriptions[eventType][id](arg),
		);
	},
};

export default eventBus;