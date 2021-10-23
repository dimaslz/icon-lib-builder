import { useEffect, useRef, useState } from 'react';
import { eventBus } from '../utils';
import { EventBusSubscription } from '../utils/event-bus.utils';

export type Notification = {
	message: string;
};

const NotificationComponent = (): JSX.Element => {
	let eventBusSubscription: EventBusSubscription;

	const [message, setMessage] = useState<string | null>('');
	const messageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		eventBusSubscription = eventBus.subscribe(
			'notification',
			(notification: Notification): void => {
				if (message) return;
				setMessage(notification.message);

				const classList = messageRef?.current?.classList;

				classList?.add('opacity-0');
				classList?.add('flex');
				classList?.remove('hidden');

				setTimeout(() => {
					classList?.add('opacity-100');
					setTimeout(() => {
						classList?.remove('opacity-100');
						classList?.remove('flex');
						classList?.add('hidden');
						setMessage(null);
					}, 2000);
				});
			},
		);

		return () => {
			eventBusSubscription?.unsubscribe();
		};
	});

	return (
		<span>
			{message ?
				<div
					ref={messageRef}
					className="p-4 text-white w-full h-16 bg-red-800 items-center justify-center text-base transition duration-500 ease-in-out hidden absolute bottom-0 left-0 right-0 z-10"
				>
					{ message }
				</div> : null}
		</span>
	);
};

export default NotificationComponent;