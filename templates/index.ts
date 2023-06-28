import { FRAMEWORK_TEMPLATES } from '@/constants';
import type { FrameworkName, LanguageFormat } from '@/entity-type';

import fixAngularTemplate from './fix-angular-template';
import fixPReactTemplate from './fix-p-react-template';
import fixSvelteTemplate from './fix-svelte-template';
import fixVue2Template from './fix-vue2-template';
import fixVue3Template from './fix-vue3-template';

type Props = {
	framework: FrameworkName;
	lang?: LanguageFormat;
	content: string;
	iconName?: string;
	stroke?: boolean;
};

export const getTemplate = ({
	framework,
	lang,
	stroke = false,
	content,
	iconName = 'Icon',
}: Props) => {
	let template = '';

	if (lang) {
		// TODO: improve type
		template = (FRAMEWORK_TEMPLATES[framework] as any)[lang];
	} else {
		// TODO: improve type
		template = FRAMEWORK_TEMPLATES[framework] as string;
	}

	template = template.replace(/%content%/, content);

	if (/p?react/.test(framework)) {
		template = fixPReactTemplate({ template, stroke });
	} else if (framework === 'vue2') {
		template = fixVue2Template({ template, stroke, iconName });
	} else if (framework === 'vue3') {
		template = fixVue3Template({ template, stroke, iconName, lang });
	} else if (framework === 'svelte') {
		template = fixSvelteTemplate({ template, stroke, lang });
	} else if (framework === 'angular') {
		template = fixAngularTemplate({ template, stroke, iconName });
	}

	return template;
};
