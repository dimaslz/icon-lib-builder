import * as React from 'react';

type PROPS = {
  size?: number | string,
  stroke?: number | string,
  className?: string,
};

const CrossIcon: React.FC<PROPS> = ({
	size = 24,
	stroke = 1,
	className = '',
}: PROPS): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		style={{
			width: `${size}px`,
			height: `${size}px`,
			strokeWidth: `${stroke}px`,
		}}
		className={className}
	>
		<path
			d="M6 18 18 6M6 6l12 12"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default CrossIcon;
