export type Subscription = {
	[key: string]: any
}

const subscriptions: Subscription = {};
const getNextUniqueId = () => new Date().getTime();

export const eventBus = {
	subscribe: (eventType: string, callback: Function) => {
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