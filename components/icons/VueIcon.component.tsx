import * as React from 'react';

type PROPS = {
	size?: number | string;
};

const VueIcon: React.FC<PROPS> = ({
	size = 24,
}: PROPS): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 122.88 106.42"
		style={{
			width: `${size}px`,
			height: `${size}px`,
		}}
	>
		<path
			style={{ fill: '#4dba87' }}
			d="M75.63 0 61.44 24.58 47.25 0H0l61.44 106.42L122.88 0H75.63z"
		/>
		<path
			style={{ fill: '#425466' }}
			d="M75.63 0 61.44 24.58 47.25 0H24.58l36.86 63.85L98.3 0H75.63z"
		/>
	</svg>
);

export default VueIcon;
