import { SandpackPredefinedTemplate, Sandpack } from '@codesandbox/sandpack-react';
import { CrossIcon } from '../icons';

import reactJSFilesPreview from './react-js-files.preview';
import reactTSFilesPreview from './react-ts-files.preview';

type PROPS = {
	template: SandpackPredefinedTemplate;
	html: string;
	onClose: () => void;
}

const files = {
	[('react' as SandpackPredefinedTemplate)]: reactJSFilesPreview,
	[('react-ts' as SandpackPredefinedTemplate)]: reactTSFilesPreview,
};
const NotificationComponent = ({ template = 'react', html = '', onClose }: PROPS): JSX.Element => (
	<div className="absolute inset-0 z-50 flex items-center justify-center">
		<div className="p-6 relative">
			<button onClick={onClose} className="rounded-md bg-gray-900 text-white hover:opacity-70 focus:outline-none flex items-center absolute -right-4 -top-4">
				<CrossIcon size={32} className="text-white" />

			</button>
			<Sandpack
				options={{
					editorHeight: 600, // default - 300
				}}
				// Try out the included templates below!
				template={template}
				// template="react-ts"
				// template="angular"
				// template="svelte-ts"
				// template="svelte-ts"
				// template="vue"
				// template="vue3"
				// template="vanilla-ts"
				// template="vanilla" // default
				theme="dark"
				files={files[template](html)}
				// 		files={{
				// 			'/src/app/app.component.html': html,
				// 			'/src/app/app.component.ts': `import { Component } from "@angular/core";

				// @Component({
				// 	selector: "app-root",
				// 	templateUrl: "./app.component.html",
				// 	// styleUrls: ["./app.component.css"]
				// })
				// export class AppComponent {}
				// `,
				// 		}}
			/>
		</div>
	</div>);

export default NotificationComponent;