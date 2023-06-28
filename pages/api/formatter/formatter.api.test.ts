import type { Request, Response } from "express";
import type { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';

import formatter from "./index";

const createMocksWithType = createMocks<NextApiRequest & Request, NextApiResponse & Response>

describe("Api - formatter", () => {
	describe("SVG", () => {
		test("format svg", async () => {
			const { req, res } = createMocksWithType({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					script: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path d="M13,6.81l-5.95,6a2.48,2.48,0,0,1-3.54,0L1.73,11a2.53,2.53,0,0,1,0-3.55L8.07,1.09a2,2,0,0,1,2.84,0l.71.71a2,2,0,0,1,0,2.84L6,10.28a1,1,0,0,1-1.42,0l-.35-.36a1,1,0,0,1,0-1.42L8,4.76" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
					framework: "svg"
				},
			});

			await formatter(req, res);

			expect(res._getStatusCode()).toBe(200);
			expect(res._getData()).toBe(`"<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 14 14\\">\\n  <path\\n    fill=\\"none\\"\\n    stroke=\\"#000\\"\\n    stroke-linecap=\\"round\\"\\n    stroke-linejoin=\\"round\\"\\n    d=\\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\\"\\n  />\\n</svg>;\\n"`);
		});
	});

	describe("React", () => {
		test("format svg to react component (js v1 by default)", async () => {
			const { req, res } = createMocksWithType({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					script: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">\n  <path\n    fill="none"\n    stroke="#000"\n    stroke-linecap="round"\n    stroke-linejoin="round"\n    d="m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76"\n  />\n</svg>\n',
					framework: "react"
				},
			});

			await formatter(req, res);

			expect(res._getStatusCode()).toBe(200);
			expect(res._getData()).toBe('\"import * as React from \\\"react\\\";\\n\\nconst Icon = ({ size = 24, stroke = 1, style = {}, className }) => {\\n  return (\\n    <svg\\n      className={className}\\n      xmlns=\\"http://www.w3.org/2000/svg\\"\\n      viewBox=\\"0 0 14 14\\"\\n      style={{\\n        width: `${size}px`,\\n        height: `${size}px`,\\n        strokeWidth: `${stroke}px`,\\n        ...style,\\n      }}\\n    >\\n      <path\\n        fill=\\"none\\"\\n        stroke=\\"currentColor\\"\\n        d=\\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\\"\\n        strokeLinecap=\\"round\\"\\n        strokeLinejoin=\\"round\\"\\n      ></path>\\n    </svg>\\n  );\\n};\\n\\nexport default Icon;\\n\"');
		});

		test("format svg to react component (js v1 by assignament)", async () => {
			const { req, res } = createMocksWithType({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					framework: "react",
					iconName: "Icon",
					script: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 14\">\n  <path\n    fill=\"none\"\n    stroke=\"#000\"\n    stroke-linecap=\"round\"\n    stroke-linejoin=\"round\"\n    d=\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\"\n  />\n</svg>",
					type: "js-v1",
				},
			});

			await formatter(req, res);

			expect(res._getStatusCode()).toBe(200);
			expect(res._getData()).toBe('\"import * as React from \\\"react\\\";\\n\\nconst Icon = ({ size = 24, stroke = 1, style = {}, className }) => {\\n  return (\\n    <svg\\n      className={className}\\n      xmlns=\\"http://www.w3.org/2000/svg\\"\\n      viewBox=\\"0 0 14 14\\"\\n      style={{\\n        width: `${size}px`,\\n        height: `${size}px`,\\n        strokeWidth: `${stroke}px`,\\n        ...style,\\n      }}\\n    >\\n      <path\\n        fill=\\"none\\"\\n        stroke=\\"currentColor\\"\\n        d=\\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\\"\\n        strokeLinecap=\\"round\\"\\n        strokeLinejoin=\\"round\\"\\n      ></path>\\n    </svg>\\n  );\\n};\\n\\nexport default Icon;\\n\"');
		});

		test("format svg to react component (js v2 by assignament)", async () => {
			const { req, res } = createMocksWithType({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					framework: "react",
					iconName: "Icon",
					script: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 14\">\n  <path\n    fill=\"none\"\n    stroke=\"#000\"\n    stroke-linecap=\"round\"\n    stroke-linejoin=\"round\"\n    d=\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\"\n  />\n</svg>",
					type: "js-v2",
				},
			});

			await formatter(req, res);

			expect(res._getStatusCode()).toBe(200);
			expect(res._getData()).toBe('\"import * as React from \\"react\\";\\n\\nfunction Icon({ size = 24, stroke = 1, style = {}, className }) {\\n  return (\\n    <svg\\n      className={className}\\n      xmlns=\\"http://www.w3.org/2000/svg\\"\\n      viewBox=\\"0 0 14 14\\"\\n      style={{\\n        width: `${size}px`,\\n        height: `${size}px`,\\n        strokeWidth: `${stroke}px`,\\n        ...style,\\n      }}\\n    >\\n      <path\\n        fill=\\"none\\"\\n        stroke=\\"currentColor\\"\\n        d=\\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\\"\\n        strokeLinecap=\\"round\\"\\n        strokeLinejoin=\\"round\\"\\n      ></path>\\n    </svg>\\n  );\\n}\\n\\nexport default Icon;\\n\"');
		});

		test("format svg to react component (ts by assignament)", async () => {
			const { req, res } = createMocksWithType({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					framework: "react",
					iconName: "Icon",
					script: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 14\">\n  <path\n    fill=\"none\"\n    stroke=\"#000\"\n    stroke-linecap=\"round\"\n    stroke-linejoin=\"round\"\n    d=\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\"\n  />\n</svg>",
					type: "ts",
				},
			});

			await formatter(req, res);

			expect(res._getStatusCode()).toBe(200);
			expect(res._getData()).toBe('\"import * as React from \\"react\\";\\n\\ntype PROPS = {\\n  size?: number | string,\\n  stroke?: number | string,\\n  style?: React.CSSProperties,\\n  className?: string | undefined,\\n};\\n\\nconst Icon: React.FC<PROPS> = ({\\n  size = 24,\\n  stroke = 1,\\n  style = {},\\n  className,\\n}: PROPS): JSX.Element => {\\n  return (\\n    <svg\\n      className={className}\\n      xmlns=\\"http://www.w3.org/2000/svg\\"\\n      viewBox=\\"0 0 14 14\\"\\n      style={{\\n        width: `${size}px`,\\n        height: `${size}px`,\\n        strokeWidth: `${stroke}px`,\\n        ...style,\\n      }}\\n    >\\n      <path\\n        fill=\\"none\\"\\n        stroke=\\"currentColor\\"\\n        d=\\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\\"\\n        strokeLinecap=\\"round\\"\\n        strokeLinejoin=\\"round\\"\\n      ></path>\\n    </svg>\\n  );\\n};\\n\\nexport default Icon;\\n\"');
		});
	});

	describe("Preact", () => {
		test("format svg to react component (js v1 by default)", async () => {
			const { req, res } = createMocksWithType({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					script: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">\n  <path\n    fill="none"\n    stroke="#000"\n    stroke-linecap="round"\n    stroke-linejoin="round"\n    d="m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76"\n  />\n</svg>\n',
					framework: "preact"
				},
			});

			await formatter(req, res);

			expect(res._getStatusCode()).toBe(200);
			expect(res._getData()).toBe('\"import { h } from \\"preact\\";\\n\\nconst Icon = ({ size = 24, stroke = 1, style = {}, className }) => {\\n  return (\\n    <svg\\n      className={className}\\n      xmlns=\\"http://www.w3.org/2000/svg\\"\\n      viewBox=\\"0 0 14 14\\"\\n      style={{\\n        width: `${size}px`,\\n        height: `${size}px`,\\n        strokeWidth: `${stroke}px`,\\n        ...style,\\n      }}\\n    >\\n      <path\\n        fill=\\"none\\"\\n        stroke=\\"currentColor\\"\\n        d=\\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\\"\\n        strokeLinecap=\\"round\\"\\n        strokeLinejoin=\\"round\\"\\n      ></path>\\n    </svg>\\n  );\\n};\\n\\nexport default Icon;\\n\"');
		});

		test("format svg to preact component (js v1 by assignament)", async () => {
			const { req, res } = createMocksWithType({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					framework: "preact",
					iconName: "Icon",
					script: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 14\">\n  <path\n    fill=\"none\"\n    stroke=\"#000\"\n    stroke-linecap=\"round\"\n    stroke-linejoin=\"round\"\n    d=\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\"\n  />\n</svg>",
					type: "js-v1",
				},
			});

			await formatter(req, res);

			expect(res._getStatusCode()).toBe(200);
			expect(res._getData()).toBe('\"import { h } from \\"preact\\";\\n\\nconst Icon = ({ size = 24, stroke = 1, style = {}, className }) => {\\n  return (\\n    <svg\\n      className={className}\\n      xmlns=\\"http://www.w3.org/2000/svg\\"\\n      viewBox=\\"0 0 14 14\\"\\n      style={{\\n        width: `${size}px`,\\n        height: `${size}px`,\\n        strokeWidth: `${stroke}px`,\\n        ...style,\\n      }}\\n    >\\n      <path\\n        fill=\\"none\\"\\n        stroke=\\"currentColor\\"\\n        d=\\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\\"\\n        strokeLinecap=\\"round\\"\\n        strokeLinejoin=\\"round\\"\\n      ></path>\\n    </svg>\\n  );\\n};\\n\\nexport default Icon;\\n\"');
		});

		test("format svg to preact component (js v2 by assignament)", async () => {
			const { req, res } = createMocksWithType({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					framework: "preact",
					iconName: "Icon",
					script: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 14\">\n  <path\n    fill=\"none\"\n    stroke=\"#000\"\n    stroke-linecap=\"round\"\n    stroke-linejoin=\"round\"\n    d=\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\"\n  />\n</svg>",
					type: "js-v2",
				},
			});

			await formatter(req, res);

			expect(res._getStatusCode()).toBe(200);
			expect(res._getData()).toBe('\"import { h } from \\"preact\\";\\n\\nfunction Icon({ size = 24, stroke = 1, style = {}, className }) {\\n  return (\\n    <svg\\n      className={className}\\n      xmlns=\\"http://www.w3.org/2000/svg\\"\\n      viewBox=\\"0 0 14 14\\"\\n      style={{\\n        width: `${size}px`,\\n        height: `${size}px`,\\n        strokeWidth: `${stroke}px`,\\n        ...style,\\n      }}\\n    >\\n      <path\\n        fill=\\"none\\"\\n        stroke=\\"currentColor\\"\\n        d=\\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\\"\\n        strokeLinecap=\\"round\\"\\n        strokeLinejoin=\\"round\\"\\n      ></path>\\n    </svg>\\n  );\\n}\\n\\nexport default Icon;\\n\"');
		});

		test("format svg to preact component (ts by assignament)", async () => {
			const { req, res } = createMocksWithType({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					framework: "preact",
					iconName: "Icon",
					script: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 14\">\n  <path\n    fill=\"none\"\n    stroke=\"#000\"\n    stroke-linecap=\"round\"\n    stroke-linejoin=\"round\"\n    d=\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\"\n  />\n</svg>",
					type: "ts",
				},
			});

			await formatter(req, res);

			expect(res._getStatusCode()).toBe(200);
			expect(res._getData()).toBe('\"import { h } from \\"preact\\";\\n\\ntype PROPS = {\\n  size?: number | string,\\n  stroke?: number | string,\\n  style?: React.CSSProperties,\\n  className?: string | undefined,\\n};\\n\\nconst Icon = ({ size = 24, stroke = 1, style = {}, className }: PROPS) => {\\n  return (\\n    <svg\\n      className={className}\\n      xmlns=\\"http://www.w3.org/2000/svg\\"\\n      viewBox=\\"0 0 14 14\\"\\n      style={{\\n        width: `${size}px`,\\n        height: `${size}px`,\\n        strokeWidth: `${stroke}px`,\\n        ...style,\\n      }}\\n    >\\n      <path\\n        fill=\\"none\\"\\n        stroke=\\"currentColor\\"\\n        d=\\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\\"\\n        strokeLinecap=\\"round\\"\\n        strokeLinejoin=\\"round\\"\\n      ></path>\\n    </svg>\\n  );\\n};\\n\\nexport default Icon;\\n\"');
		});
	});

	describe("Vue2", () => {
		test("format svg to vue2 component (js by assignament)", async () => {
			const { req, res } = createMocksWithType({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					framework: "vue2",
					iconName: "IconName",
					script: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 14\">\n  <path\n    fill=\"none\"\n    stroke=\"#000\"\n    stroke-linecap=\"round\"\n    stroke-linejoin=\"round\"\n    d=\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\"\n  />\n</svg>",
					type: "js",
				},
			});

			await formatter(req, res);

			expect(res._getStatusCode()).toBe(200);
			expect(res._getData()).toBe('\"<template>\\n  <svg\\n    xmlns=\\"http://www.w3.org/2000/svg\\"\\n    viewBox=\\"0 0 14 14\\"\\n    :style=\\"{\\n      width: `${size}px`,\\n      height: `${size}px`,\\n      strokeWidth: `${stroke}`,\\n    }\\"\\n  >\\n    <path\\n      fill=\\"none\\"\\n      stroke=\\"currentColor\\"\\n      stroke-linecap=\\"round\\"\\n      stroke-linejoin=\\"round\\"\\n      d=\\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\\"\\n    ></path>\\n  </svg>\\n</template>\\n\\n<script>\\nexport default {\\n  name: \\"IconName\\",\\n  props: {\\n    size: {\\n      type: [Number, String],\\n      default: 24,\\n    },\\n    stroke: {\\n      type: [Number, String],\\n      default: 1,\\n    },\\n  },\\n};\\n</script>\\n\"');
		});

		test("format svg to vue2 component (ts by assignament)", async () => {
			const { req, res } = createMocksWithType({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					framework: "vue2",
					iconName: "IconName",
					script: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 14\">\n  <path\n    fill=\"none\"\n    stroke=\"#000\"\n    stroke-linecap=\"round\"\n    stroke-linejoin=\"round\"\n    d=\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\"\n  />\n</svg>",
					type: "ts",
				},
			});

			await formatter(req, res);

			expect(res._getStatusCode()).toBe(200);
			expect(res._getData()).toBe('\"<template>\\n  <svg\\n    xmlns=\\"http://www.w3.org/2000/svg\\"\\n    viewBox=\\"0 0 14 14\\"\\n    :style=\\"{\\n      width: `${size}px`,\\n      height: `${size}px`,\\n      strokeWidth: `${stroke}`,\\n    }\\"\\n  >\\n    <path\\n      fill=\\"none\\"\\n      stroke=\\"currentColor\\"\\n      stroke-linecap=\\"round\\"\\n      stroke-linejoin=\\"round\\"\\n      d=\\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\\"\\n    ></path>\\n  </svg>\\n</template>\\n\\n<script lang=\\"ts\\">\\nimport { defineComponent } from \\"vue\\";\\n\\nexport default defineComponent({\\n  name: \\"IconName\\",\\n  props: {\\n    size: {\\n      type: String,\\n      default: 24,\\n    },\\n  },\\n});\\n</script>\\n\"');
		});
	});

	describe("Vue3", () => {
		test("format svg to vue3 component (js by assignament)", async () => {
			const { req, res } = createMocksWithType({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					framework: "vue3",
					iconName: "IconName",
					script: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 14\">\n  <path\n    fill=\"none\"\n    stroke=\"#000\"\n    stroke-linecap=\"round\"\n    stroke-linejoin=\"round\"\n    d=\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\"\n  />\n</svg>",
					type: "js",
				},
			});

			await formatter(req, res);

			expect(res._getStatusCode()).toBe(200);
			expect(res._getData()).toBe('\"<template>\\n  <svg\\n    xmlns=\\"http://www.w3.org/2000/svg\\"\\n    viewBox=\\"0 0 14 14\\"\\n    :style=\\"{\\n      width: `${size}px`,\\n      height: `${size}px`,\\n      strokeWidth: `${stroke}`,\\n    }\\"\\n  >\\n    <path\\n      fill=\\"none\\"\\n      stroke=\\"currentColor\\"\\n      stroke-linecap=\\"round\\"\\n      stroke-linejoin=\\"round\\"\\n      d=\\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\\"\\n    ></path>\\n  </svg>\\n</template>\\n\\n<script>\\nexport default {\\n  name: \\"IconName\\",\\n  props: {\\n    size: {\\n      type: [Number, String],\\n      default: 24,\\n    },\\n    stroke: {\\n      type: [Number, String],\\n      default: 1,\\n    },\\n  },\\n};\\n</script>\\n\"');
		});

		test("format svg to vue3 component (ts by assignament)", async () => {
			const { req, res } = createMocksWithType({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					framework: "vue3",
					iconName: "IconName",
					script: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 14\">\n  <path\n    fill=\"none\"\n    stroke=\"#000\"\n    stroke-linecap=\"round\"\n    stroke-linejoin=\"round\"\n    d=\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\"\n  />\n</svg>",
					type: "ts",
				},
			});

			await formatter(req, res);

			expect(res._getStatusCode()).toBe(200);
			expect(res._getData()).toBe('\"<template>\\n  <svg\\n    xmlns=\\"http://www.w3.org/2000/svg\\"\\n    viewBox=\\"0 0 14 14\\"\\n    :style=\\"{\\n      width: `${size}px`,\\n      height: `${size}px`,\\n      strokeWidth: `${stroke}`,\\n    }\\"\\n  >\\n    <path\\n      fill=\\"none\\"\\n      stroke=\\"currentColor\\"\\n      stroke-linecap=\\"round\\"\\n      stroke-linejoin=\\"round\\"\\n      d=\\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\\"\\n    ></path>\\n  </svg>\\n</template>\\n\\n<script lang=\\"ts\\">\\nimport { defineComponent } from \\"vue\\";\\n\\nexport default defineComponent({\\n  name: \\"IconName\\",\\n  props: {\\n    size: {\\n      type: [Number, String],\\n      default: 24,\\n    },\\n    stroke: {\\n      type: [Number, String],\\n      default: 1,\\n    },\\n  },\\n});\\n</script>\\n\"');
		});
	});

	describe("Svelte", () => {
		test("format svg to svelte component (js by assignament)", async () => {
			const { req, res } = createMocksWithType({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					framework: "svelte",
					iconName: "IconName",
					script: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 14\">\n  <path\n    fill=\"none\"\n    stroke=\"#000\"\n    stroke-linecap=\"round\"\n    stroke-linejoin=\"round\"\n    d=\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\"\n  />\n</svg>",
					type: "js",
				},
			});

			await formatter(req, res);

			expect(res._getStatusCode()).toBe(200);
			expect(res._getData()).toBe('\"<script>\\n  export let size = 24;\\n  export let stroke = 1;\\n</script>\\n\\n<svg\\n  xmlns=\\"http://www.w3.org/2000/svg\\"\\n  viewBox=\\"0 0 14 14\\"\\n  style={`width: ${size}px; height: ${size}px; stroke-width=${stroke};`}\\n  ><path\\n    fill=\\"none\\"\\n    stroke=\\"currentColor\\"\\n    stroke-linecap=\\"round\\"\\n    stroke-linejoin=\\"round\\"\\n    d=\\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\\"\\n  /></svg\\n>\\n\"');
		});

		test("format svg to svelte component (ts by assignament)", async () => {
			const { req, res } = createMocksWithType({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					framework: "svelte",
					iconName: "IconName",
					script: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 14\">\n  <path\n    fill=\"none\"\n    stroke=\"#000\"\n    stroke-linecap=\"round\"\n    stroke-linejoin=\"round\"\n    d=\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\"\n  />\n</svg>",
					type: "ts",
				},
			});

			await formatter(req, res);

			expect(res._getStatusCode()).toBe(200);
			expect(res._getData()).toBe('\"<script lang=\\"ts\\">\\n  export let size: string | number = 24;\\n  export let stroke: string | number = 1;\\n</script>\\n\\n<svg\\n  xmlns=\\"http://www.w3.org/2000/svg\\"\\n  viewBox=\\"0 0 14 14\\"\\n  style={`width: ${size}px; height: ${size}px; stroke-width=${stroke};`}\\n  ><path\\n    fill=\\"none\\"\\n    stroke=\\"currentColor\\"\\n    stroke-linecap=\\"round\\"\\n    stroke-linejoin=\\"round\\"\\n    d=\\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\\"\\n  /></svg\\n>\\n\"');
		});
	});

	describe("Angular", () => {
		test("format svg to angular component (only TS by default)", async () => {
			const { req, res } = createMocksWithType({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					framework: "angular",
					iconName: "IconName",
					script: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14 14\">\n  <path\n    fill=\"none\"\n    stroke=\"#000\"\n    stroke-linecap=\"round\"\n    stroke-linejoin=\"round\"\n    d=\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\"\n  />\n</svg>",
				},
			});

			await formatter(req, res);

			expect(res._getStatusCode()).toBe(200);
			expect(res._getData()).toBe('\"import { Component, Input } from \\"@angular/core\\";\\n\\n@Component({\\n  selector: \\"icon-name\\",\\n  template: `<svg\\n    xmlns=\\"http://www.w3.org/2000/svg\\"\\n    viewBox=\\"0 0 14 14\\"\\n    style=\\"width: {{ size }}px; height: {{ size }}px; color: {{ color }}; {{\\n      style\\n    }} stroke-width: {{ stroke }}\\"\\n  >\\n    <path\\n      fill=\\"none\\"\\n      stroke=\\"currentColor\\"\\n      stroke-linecap=\\"round\\"\\n      stroke-linejoin=\\"round\\"\\n      d=\\"m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76\\"\\n    ></path>\\n  </svg>`,\\n})\\nexport class IconNameComponent {\\n  @Input() style: string = \\"\\";\\n  @Input() size: number | string = 24;\\n  @Input() stroke: number | string = 24;\\n  @Input() color: string = \\"\\";\\n\\n  constructor() {}\\n}\\n\"');
		});
	});
});