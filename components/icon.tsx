import React from "react";

function Icon({ width = 24, height = 24, className }: {
	width?: string | number,
	height?: string | number,
	className?: string,
}) {
  return (
		<svg
			className={className}
      x="0px"
      y="0px"
      stroke=""
      fill="currentColor"
      viewBox="0 0 80 80"
			style={{ width, height }}
			color="currentColor"
    >
      <rect width="80" height="80" fill="none" />
      <path
        d="M75.5 57.1C75.4 57 75.4 57 75.3 56.9L75.2 56.8L75.1 56.7L75 56.6C74 55.9 72.8 55.5 71.6 55.5H60.7C59.5 55.5 58.6 54.5 58.6 53.3C58.6 52.1 59.6 51.1 60.7 51.1H71.6C72.4 51.1 73.2 51.2 74 51.4V46.6C74 32.5 65.9 19.9 54.2 15.5L51.5 39.5C51.4 40.7 50.3 41.6 49.1 41.4C47.9 41.3 47.1 40.2 47.2 39L49.5 18C49.8 15.6 49 13.3 47.5 11.5C47.3 11.3 47 11 46.5 11H32.9C32.4 11 32.1 11.3 31.9 11.5C30.4 13.3 29.6 15.6 29.9 18L32.2 39C32.3 40.2 31.5 41.3 30.3 41.4C29.1 41.5 28.1 40.7 27.9 39.5L25.2 15.6C13.5 20 5.39999 32.6 5.39999 46.7V51.5C6.19999 51.3 7 51.2 7.8 51.2H45.4C46.6 51.2 47.5 52.2 47.5 53.4C47.5 54.6 46.5 55.6 45.4 55.6H7.89999C6.59999 55.6 5.5 56 4.5 56.7L4.39999 56.8L4.3 56.9L4.2 57C4.1 57.1 4.1 57.1 4 57.2C3.1 58 2.4 59.1 2 60.4H77.5C77.1 59 76.4 57.9 75.5 57.1Z"
        fill="currentColor"
      />
      <rect x="10" y="63.5" width="60" height="5" fill="currentColor" />
    </svg>
  );
}

export default Icon;