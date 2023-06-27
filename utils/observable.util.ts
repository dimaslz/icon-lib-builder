type Subscriber<T> = (value: T) => void;
export type ObservableSubscription = {
	unsubscribe: () => void;
}

class Observable<T> {
	private static instance: Observable<any>;
	private subscribers = new Set<Subscriber<T>>();

	// eslint-disable-next-line no-useless-constructor
	constructor(private value: T) { }

	get(): T {
		return this.value;
	}

	static init<T>(value: T): Observable<T> {
		if (!Observable.instance) {
			Observable.instance = new Observable<T>(value);
		}

		return Observable.instance;
	}

	set(newValue: T): void {
		if (this.value === newValue) return;
		this.value = newValue;

		this.subscribers.forEach((listener) => listener(this.value));
	}

	subscribe(subscriber: Subscriber<T>): ObservableSubscription {
		this.subscribers.add(subscriber);

		return {
			unsubscribe: (): void => {
				this.subscribers.delete(subscriber);
			},
		};
	}

	unsubscribe(subscriber: Subscriber<T>): void {
		this.subscribers.delete(subscriber);
	}
}

export type { Subscriber };
export default <T>(initialData: T) => Observable.init<T>(initialData);