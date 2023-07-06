import { Framework, FrameworkRenderType } from '@/entity-type';

import { JSIcon, TSIcon } from './icons';

type Props = {
	types: FrameworkRenderType[] | undefined;
	selected: string;
	onChange: (f: Framework, type: FrameworkRenderType) => void;
	framework: Framework;
	className: string;
};

const FrameworkRenderList = ({ types, selected, onChange, framework, className }: Props) => (
<div className={`${className} flex`}>
	{types?.map(
		(type, key) => (
			<button
				className={[
					'text-xs text-white mx-1 p-2 rounded-md hover:bg-gray-500 cursor-pointer flex items-center',
					type.name === selected
						? 'bg-gray-400'
						: 'bg-gray-700',
				].join(' ')}
				key={`${key}f.label`}
				onClick={() => onChange(framework, type)}
			>
				{['ts', 'compressed'].includes(type.name) &&
					<span><TSIcon className="text-blue-500" /></span>
				}
				{type.name.includes('js') &&
					<span><JSIcon className="text-yellow-500" /></span>
				}
				<span className="ml-2">{type.label}</span>
			</button>
		),
	)}
</div>);

export default FrameworkRenderList;