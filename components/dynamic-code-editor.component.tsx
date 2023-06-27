import dynamic from 'next/dynamic';

const DynamicCodeEditor = dynamic(
	async () => import('@/components/code-editor.component'),
	{
		loading: () => <div>Loading</div>,
		ssr: false,
	},
);

export default DynamicCodeEditor;
