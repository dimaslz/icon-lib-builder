type PROPS = {
  size?: number | string,
  stroke?: number | string,
  style?: React.CSSProperties,
  className?: string | undefined,
};

const DropIcon: React.FC<PROPS> = ({
	size = 24,
	style = {},
	className,
}: PROPS): JSX.Element => (
	<svg
		className={className}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 14 14"
		style={{ width: `${size}px`, height: `${size}px`, ...style }}
	>
		<path
			fill="none"
			stroke="currentColor"
			d="M11.5 9C11.5 6.51 7 .5 7 .5S2.5 6.51 2.5 9a4.5 4.5 0 0 0 9 0Z"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default DropIcon;
