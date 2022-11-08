export default (html: string) => ({
	'/Icon.tsx': {
		code: html,
		active: true,
	},
	'/App.tsx': {
		code: `
import { useState } from 'react';
import Icon from "./Icon.tsx";

export default function App(): JSX.Element {
const [size, setSize] = useState(36);
const [color, setColor] = useState("black");

const increaseSize = () => {
	setSize(() => size+10);
};

const decreaseSize = () => {
	setSize(() => size-10);
};

return <div>
	<div>Size</div>
	<div>
		<button onClick={decreaseSize}>-</button>
		<span>{size}</span>
		<button onClick={increaseSize}>+</button>
	</div>
	<div>Color</div>
	<div>
		<button onClick={() => setColor('black')}>black</button>
		<button onClick={() => setColor('red')}>red</button>
		<button onClick={() => setColor('green')}>green</button>
		<button onClick={() => setColor('blue')}>blue</button>
	</div>

	<div style={{ color }}>
		<Icon size={size} />
	</div>
</div>
}`,
		hidden: true,
	},
});