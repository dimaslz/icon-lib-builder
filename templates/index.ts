export default {
	react: {
		ts: `import * as React from "react";

		type PROPS = {
			size?: number | string;
			stroke?: number | string;
			style?: React.CSSProperties;
		}

		const %iconName%: React.FC<PROPS> = ({ size = 24, stroke = 1, style = {} }: PROPS): JSX.Element => {
			return (
				%content%
			);
		};

		export default %iconName%;
		`,
		"js-v1": `import * as React from "react";

		const %iconName% = ({ size = 24, stroke = 1, style = {} }) => {
			return (
				%content%
			);
		}

		export default %iconName%;
		`,
		"js-v2": `import * as React from "react";

		function %iconName%({ size = 24, stroke = 1, style = {} }) {
			return (
				%content%
			);
		}

		export default %iconName%;
		`,
	},
	preact: {
		"js-v1": `import { h } from "preact";

		const %iconName% = ({ size = 24, stroke = 1, style = {} }) => {
			return (
				%content%
			);
		}

		export default %iconName%;
		`,
		"js-v2": `import { h } from "preact";

		function %iconName%({ size = 24, stroke = 1, style = {} }) {
			return (
				%content%
			);
		}

		export default %iconName%;
		`,
		ts: `import { h } from "preact";

		type PROPS = {
			size?: number | string;
			stroke?: number | string;
			style?: {};
		};

		const %iconName% = ({ size = 24, stroke = 1, style = {} }: PROPS) => {
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
	props: {
		size: {
			type: [Number, String],
			default: 24
		},
	},
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
	@Input() style: string = "";
	@Input() size: number = 24;
	@Input() stroke: number|string = 2;
	@Input() color: string = "";

	constructor() { }
}`,
	vue3: {
		js: `<template>
	%content%
</template>

<script>
	export default {
		name: "%iconName%",
		props: {
			size: {
				type: Number,
				default: 24,
			},
		},
	}
</script>`,
		ts: `<template>
	%content%
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: "%iconName%",
  props: {
		size: {
			type: Number,
			default: 24,
		},
	},
})
</script>`,
		compressed: `<script setup lang="ts">
	defineProps<{ size: number }>();
</script>

<template>
	%content%
</template>`,
	},
};