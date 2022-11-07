import * as React from 'react';

type PROPS = {
  size?: number | string,
  stroke?: number | string,
};

const VueIcon: React.FC<PROPS> = ({
	size = 24,
}: PROPS): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 32 32"
		style={{ width: `${size}px`, height: `${size}px` }}
	>
		<path fill="#673ab8" d="m16 2 12.12 7v14L16 30 3.88 23V9z" />
		<ellipse
			fill="none"
			stroke="#fff"
			cx="16"
			cy="16"
			rx="10.72"
			ry="4.1"
			transform="rotate(-37.5 16.007 15.996)"
		/>
		<ellipse
			fill="none"
			stroke="#fff"
			cx="16"
			cy="16"
			rx="4.1"
			ry="10.72"
			transform="rotate(-52.5 15.998 15.994)"
		/>
		<circle fill="#fff" cx="16" cy="16" r="1.86" />
	</svg>
);

export default VueIcon;
