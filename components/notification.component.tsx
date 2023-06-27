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
					className="absolute inset-x-0 bottom-0 z-10 hidden h-16 w-full items-center justify-center bg-red-800 p-4 text-base text-white transition duration-500 ease-in-out"
				>
					{ message }
				</div> : null}
		</span>
	);
};

export default NotificationComponent;