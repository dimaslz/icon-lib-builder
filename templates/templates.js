export default {
  react: `import React from "react";

function Icon({ size = 24 }) {
  return (
    %content%
  );
}

export default Icon;
`,
  preact: `function Icon({ size = 24 }) {
  return (
    %content%
  );
}

export default Icon;
`,
  vue: `<template>
  %content%
</template>

<script>
export default {
  props: {
    size: {
      type: [Number, String],
      default: 24
    },
  },
};
</script>`,
  angular: `import { Component, Input, OnChanges, SimpleChanges, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: \`%content%\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements OnInit, OnChanges {
  @Input() style: string = "";
  @Input() size: number = 24;
  @Input() stroke: number|string = 2;
  @Input() color: string = "";

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    const colorHasChanged = changes.color?.previousValue !== changes.color?.currentValue;
    const sizeHasChanged = changes.size?.previousValue !== changes.size?.currentValue;
    const strokeHasChanged = changes.stroke?.previousValue !== changes.stroke?.currentValue;

    if (colorHasChanged || sizeHasChanged || strokeHasChanged) {
      this.style = "";
      this.renderStyle();
    }
  }

  ngOnInit(): void {
    this.renderStyle();
  }

  renderStyle() {
    let style = [];
    if (this.size) {
      style.push(\`width: \${this.size}px; height: \${this.size}px;\`);
    }
    if (this.color) {
      style.push(\`color: \${this.color};\`);
    }

    this.style = style.join(' ') + this.style;
  }
}`
}