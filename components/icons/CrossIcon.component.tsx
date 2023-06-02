import * as React from 'react';

type PROPS = {
  size?: number | string,
  stroke?: number | string,
  style?: React.CSSProperties,
  className?: string | undefined,
};

const CrossIcon: React.FC<PROPS> = ({
	size = 24,
	stroke = 1,
	style = {},
	className,
}: PROPS): JSX.Element => (
	<svg
		className={className}
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		style={{
			width: `${size}px`,
			height: `${size}px`,
			strokeWidth: `${stroke}px`,
			...style,
		}}
	>
		<path
			d="M6 18 18 6M6 6l12 12"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default CrossIcon;
