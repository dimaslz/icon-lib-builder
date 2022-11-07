import * as React from 'react';

export type PROPS = {
  size?: number | string,
  stroke?: number | string,
};

const AngularIcon: React.FC<PROPS> = ({
	size = 24,
}: PROPS): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 114.4 122.88"
		style={{
			width: `${size}px`,
			height: `${size}px`,
		}}
	>
		<path
			style={{ fillRule: 'evenodd', clipRule: 'evenodd', fill: '#dd0031' }}
			d="M57.2 0 0 20.4l8.72 75.63 48.48 26.85 48.48-26.85 8.72-75.63L57.2 0z"
		/>
		<path
			style={{ fillRule: 'evenodd', clipRule: 'evenodd', fill: '#c3002f' }}
			d="M57.2 0v13.64-.06 109.3l48.48-26.85 8.72-75.63L57.2 0z"
		/>
		<path
			d="M57.2 13.58 21.44 93.76h13.33l7.19-17.94h30.35l7.19 17.94h13.33L57.2 13.58zm10.45 51.18H46.76L57.2 39.63l10.45 25.13z"
			style={{ fillRule: 'evenodd', clipRule: 'evenodd', fill: '#fff' }}
		/>
	</svg>
);

export default AngularIcon;
