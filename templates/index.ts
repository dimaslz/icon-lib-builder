import _ from 'lodash';

const templates: any = {
	react: {
		ts: `import * as React from "react";

		%type%

		const %iconName%: React.FC<PROPS> = (%props%: PROPS): JSX.Element => {
			return (
				%content%
			);
		};

		export default %iconName%;
		`,
		'js-v1': `import * as React from "react";

		const %iconName% = (%props%) => {
			return (
				%content%
			);
		}

		export default %iconName%;
		`,
		'js-v2': `import * as React from "react";

		function %iconName%(%props%) {
			return (
				%content%
			);
		}

		export default %iconName%;
		`,
	},
	preact: {
		'js-v1': `import { h } from "preact";

		const %iconName% = (%props%) => {
			return (
				%content%
			);
		}

		export default %iconName%;
		`,
		'js-v2': `import { h } from "preact";

		function %iconName%(%props%) {
			return (
				%content%
			);
		}

		export default %iconName%;
		`,
		ts: `import { h } from "preact";

		%type%

		const %iconName% = (%props%: PROPS) => {
			return (
				%content%
			);
		}

		export default %iconName%;
		`,
	},
	vue2: {
		js: `<template>
	%content%
</template>

<script>
export default {
	name: "%iconName%",
	%props%
};
</script>`,
		ts: `<template>
	%content%
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "%iconName%",
	props: {
		size: {
			type: String,
			default: 24,
		},
	},
});
</script>`,
	},
	angular: `import { Component, Input } from '@angular/core';

@Component({
	selector: '%iconName%',
	template: \`%content%\`,
})
export class %classIconName%Component {
	%props%

	constructor() { }
}`,
	vue3: {
		js: `<template>
	%content%
</template>

<script>
	export default {
		name: "%iconName%",
		%props%
	}
</script>`,
		ts: `<template>
	%content%
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: "%iconName%",
  %props%,
})
</script>`,
		compressed: `<script setup lang="ts">
	%props%
</script>

<template>
	%content%
</template>`,
	},
	svelte: {
		js: `<script>
	%props%
</script>
%content%`,
		ts: `<script lang="ts">
	%props%
</script>
%content%`,
	},
};

export type Framework = 'react' | 'vue2' | 'vue3' | 'angular' | 'preact' | 'svelte';
export type Lang = 'js' | 'js-v1' | 'js-v2' | 'ts' | 'compressed' | 'undefined';
type Props = {
	framework: Framework;
	lang?: Lang;
	content: string;
	iconName?: string;
	stroke?: boolean;
};

export const getTemplate = ({
	framework,
	lang,
	stroke = false,
	content,
	iconName,
}: Props) => {
	let template = (lang
		? templates[framework][lang]
		: templates[framework])
		.replace(/%content%/, content);

	if (/p?react/.test(framework)) {
		if (stroke) {
			template = template.replace('%type%', `type PROPS = {
	size?: number | string;
	stroke?: number | string;
	style?: React.CSSProperties;
	className?: string | undefined;
}`);
			template = template
				.replace('<svg', '<svg\nclassName={className}')
				.replace('%props%', '{ size = 24, stroke = 1, style = {}, className }');
		} else {
			template = template.replace('%props%', '{ size = 24, style = {}, className }');
			template = template.replace('%type%', `type PROPS = {
	size?: number | string;
	style?: React.CSSProperties;
	className?: string | undefined;
}`);
		}

		template = template
			.replace(/stroke-linecap=["'](.*?)["']/gm, "strokeLinecap='$1'")
			.replace(/stroke-linejoin=["'](.*?)["']/gm, "strokeLinejoin='$1'")
			.replace('"%className%"', '{className}');
	} else if (framework === 'vue2') {
		if (stroke) {
			template = template
				.replace(/stroke-width=["'].*?["']/, ':stroke-width="stroke"')
				.replace(/:style=["']{(.*?)}["']/gm, ':style="{$1, strokeWidth: `${stroke}`}"')
				.replace('%props%', `props: {
		size: {
			type: [Number, String],
			default: 24
		},
		stroke: {
			type: [Number, String],
			default: 1
		},
	},`);
		} else {
			template = template
				.replace('%props%', `props: {
		size: {
			type: [Number, String],
			default: 24
		},
	},`);
		}
	} else if (framework === 'vue3') {
		if (stroke) {
			template = template
				.replace(/stroke-width=["'].*?["']/, ':stroke-width="stroke"')
				.replace(/:style=["']{(.*?)}["']/gm, ':style="{$1, strokeWidth: `${stroke}`}"')
				.replace('%props%', lang !== 'compressed' ? `props: {
		size: {
			type: [Number, String],
			default: 24,
		},
		stroke: {
			type: [Number, String],
			default: 1,
		},
	}` : `defineProps<{ size: number | string, stroke: number | string }>();`);
		} else {
			template = template
				.replace('%props%', lang !== 'compressed' ? `	props: {
		size: {
			type: [Number, String],
			default: 24,
		},
	}` : `defineProps<{ size: number | string }>();`);
		}
	} else if (framework === 'svelte') {
		if (stroke) {
			template = template
				.replace(/stroke-width=["'].*?["']/, 'stroke-width={stroke}')
				.replace(/style={[^]+}/gm, 'style={`width: ${size}px; height: ${size}px; stroke-width=${stroke};`}')
				.replace('%props%', lang === 'js'
					? `export let size = 24;
		export let stroke = 1;`
					: `export let size: string | number = 24;
		export let stroke: string | number = 1;`);
		} else {
			template = template
				.replace(/style={[^]+}/gm, 'style={`width: ${size}px; height: ${size}px; `}')
				.replace('%props%', lang === 'js' ? `export let size = 24;` : `export let size: string | number = 24;`);
		}
	} else if (framework === 'angular') {
		template = template
			.replace(/%iconName%/g, _.kebabCase(iconName))
			.replace(/%classIconName%/g, iconName);

		if (stroke) {
			template = template
				.replace(/stroke-width=["'].*?["']/, '')
				.replace(/style=["']([^"']+)["']/gm, 'style="$1 stroke-width: {{ stroke }}"')
				.replace(/%props%/g, `@Input() style: string = "";
				@Input() size: number | string = 24;
				@Input() stroke: number | string = 24;
				@Input() color: string = "";`);
		} else {
			template = template
				.replace(/style={[^]+}/gm, 'style={`width: ${size}px; height: ${size}px;')
				.replace('%props%', `@Input() style: string = "";
		@Input() size: number | string = 24;
		@Input() color: string = "";`);
		}
	}

	return template;
};

export default templates;