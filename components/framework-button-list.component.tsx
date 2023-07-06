import { Framework, FrameworkName } from '@/entity-type';

type Props = {
	frameworks: Framework[];
	onClick: (framework: Framework) => void;
	selected: FrameworkName;
};

const FrameworkButtonList = ({ frameworks, onClick, selected }: Props) => (
	<div className="Result__format">
		<ul className="flex bg-gray-700 p-2 text-xs text-white">
			{frameworks.map((framework, key) => (
				<li key={key}>
					<button
						className={[
							'mx-1 p-2 rounded-md hover:bg-gray-500 cursor-pointer flex items-center',
							framework.name === selected
								? 'bg-gray-400'
								: 'bg-gray-700',
						].join(' ')}
						role="tab"
						aria-label={`${framework.label.toUpperCase()} framework`}
						aria-selected={framework.name === selected}
						onClick={() => onClick(framework)}
					>
						{framework.icon && <framework.icon size="16" />}
						<span className="ml-1">{framework.label}</span>
					</button>
				</li>
			))}
		</ul>
	</div>
);

export default FrameworkButtonList;