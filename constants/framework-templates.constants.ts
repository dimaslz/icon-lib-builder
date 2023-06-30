import type ExtensionMap from '@/entity-type/ExtensionMap.type';

const FRAMEWORK_TEMPLATES: ExtensionMap = {
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
	angular: `import { Component, Input } from '@angular/core';

@Component({
	selector: '%iconName%',
	template: \`%content%\`,
})
export class %classIconName%Component {
	%props%

	constructor() { }
}`,
};

export default FRAMEWORK_TEMPLATES;