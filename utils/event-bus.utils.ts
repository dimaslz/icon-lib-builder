export type Subscription = {
	[key: string]: any
}

export type UnSubscription = {
	unsubscribe?: () => void
}

export type EventBus<Event, CB, UnSub> = {
	subscribe: (eventType: Event, callback: CB) => UnSub
	publish: (eventType: Event, arg?: any) => void
}


const subscriptions: Subscription = {};
const getNextUniqueId = () => new Date().getTime();

export const eventBus: EventBus<string, () => void, UnSubscription> = {
	subscribe: (eventType: string, callback: (data: () => void) => void): UnSubscription => {
		const id = getNextUniqueId();

		if (!subscriptions[eventType]) {subscriptions[eventType] = {};}

		subscriptions[eventType][id] = callback;
		return {
			unsubscribe: () => {
				delete subscriptions[eventType][id];
				if (Object.keys(subscriptions[eventType]).length === 0) {delete subscriptions[eventType];}
			}
		};
	},

	publish: (eventType: string, arg?: any) =>  {
		if (!subscriptions[eventType]) {
			return;
		}

		Object.keys(subscriptions[eventType]).forEach((id) =>
			subscriptions[eventType][id](arg)
		);
	}
};

export default eventBus;