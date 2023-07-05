import React from 'react';

import { Loader } from './';

const FullScreenLoading: React.FC = () => (
	<div
		data-testid="loading"
		className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-gray-900 text-white"
	>
		<Loader />
	</div>
);

export default FullScreenLoading;