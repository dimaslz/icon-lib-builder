import 'tailwindcss/tailwind.css';

import Head from 'next/head';
import { useState } from 'react';
import isSvg from 'is-svg';

import TEMPLATES from '../templates/templates';

import FullScreenLoading from '../components/full-screen-loading';
import Icon from '../components/icon';
import CodeEditor from '../components/code-editor';

import CopyToClipboard from '../utils/copy-to-clipboard';

export default function Home() {
  const [svgString, setSvgString] = useState("// paste your SVG here");
  const [componentString, setComponentString] = useState("");
  const [framework, setFramework] = useState("react");
  const [editorMode, setEditorMode] = useState("javascript");
  const [sourceEditorReady, setSourceEditorReady] = useState(false);
  const [resultEditorReady, setResultEditorReady] = useState(false);

  const templates = {
    react: (svg) => TEMPLATES.react.replace('%content%', svg),
    preact: (svg) => TEMPLATES.preact.replace('%content%', svg),
    vue: (svg) => TEMPLATES.vue.replace('%content%', svg),
    angular: (svg) => TEMPLATES.angular.replace('%content%', svg)
  }

  const frameworks = [
    { label: 'React', framework: 'react', mode: 'javascript' },
    { label: 'Preact', framework: 'preact', mode: 'javascript' },
    { label: 'Vue 2/3', framework: 'vue', mode: 'javascript' },
    { label: 'Angular +2', framework: 'angular', mode: 'typescript' },
  ]

  async function onChange(value) {
    if (!isSvg(value)) return;

    setSvgString(value);
    value = await httpFormatCode(value, 'svg');

    if (!value) return;
    value = value.replace(/>;/g, '>');
    setSvgString(value);

    const { stroke, fill, viewBox, content } = getSvgData(value);
    const svgFormat = getSvgFormat({ stroke, fill, viewBox, content });

    if (!svgFormat) return Promise.resolve('');

    const script = templates[framework](svgFormat);
    await httpFormatCode(script);
  }

  function onSourceLoad() {
    setSourceEditorReady(true);
  }

  function onResultLoad() {
    setResultEditorReady(true);
  }

  function getSvgData(value) {
    let match = "";
    match = value.match(/viewBox=["'"]([^\\"']+)+/i);
    const [, viewBox = ""] = match || [];

    match = value.match(/fill=["'"]([^\\"']+)+/i);
    const [, fill = ""] = match || [];

    match = value.match(/stroke=["'"]([^\\"']+)+/i);
    const [, stroke = ""] = match || [];

    match = value.match(/<svg[^>]+>([^]+)<\/svg>/i);
    const [, content = ""] = match || [];

    return { stroke, fill, viewBox, content };
  }

  async function onFrameworkChange(fw) {
    await setFramework(fw.framework);
    await setEditorMode(fw.mode);
    const { stroke, fill, viewBox, content } = getSvgData(svgString);
    const svgFormat = getSvgFormat({ stroke, fill, viewBox, content, fw: fw.framework });

    const script = templates[fw.framework || framework](svgFormat);
    httpFormatCode(script, fw.framework);
  }

  function getSvgFormat({ stroke, fill, viewBox, content, fw }) {
    const style = {
      react: `style={{ width, height }}`,
      vue: `:style="{ width, height }"`,
      angular: `[style]="style"`,
    }[fw || framework];

    return `<svg
      x="0px"
      y="0px"
      stroke="${stroke}"
      fill="${fill}"
      viewBox="${viewBox}"
      ${style}
    >
      ${content}
    </svg>
    `;
  }

  async function httpFormatCode(script, fw) {
    const code = await fetch('/api', {
      method: 'POST',
      body: JSON.stringify({
        script,
        framework: fw || framework,
      }),
    }).then(i => i.json())
    .then(({ code }) => code);

    setComponentString(code);

    return code;
  }

  function onClickCopyResult() {
    CopyToClipboard(componentString);
  }

  return (
    <div className="w-full my-0 mx-auto h-screen flex flex-col justify-start items-center bg-gray-600">
      <Head>
        <title>Icon library builder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center w-full justify-start flex-grow">
        <header
          className="h-16 bg-gray-800 w-full flex items-center justify-center text-white text-sm"
        >
          icon library <Icon className="text-gray-400" width="50" height="50" /> builder
        </header>
        <div className="flex w-full h-full relative">
          {!sourceEditorReady && !resultEditorReady ? <FullScreenLoading /> : null}
          <div className="Source h-full w-full">
            <CodeEditor
              name="source"
              onChange={onChange}
              value={svgString}
              onLoad={onSourceLoad}
            />
          </div>
          <div className={[
            "Result w-full pl-4 h-full flex flex-col",
            !componentString ? 'pointer-events-none opacity-50' : ''
          ].join(' ')} suppressHydrationWarning={true}>
            {componentString && <button
              onClick={onClickCopyResult}
              className="px-3 py-2 rounded-sm absolute right-10 top-20 z-10 bg-gray-900 text-white hover:opacity-70 focus:outline-none"
            >copy</button>}

            <div className="Result__format">
              <ul className="text-xs text-white flex bg-gray-700 p-2">
                {frameworks.map((fw, key) => {
                  return <li
                    className={[
                      "mx-1 p-2 rounded-full hover:bg-gray-500 cursor-pointer",
                      fw.framework === framework ? 'bg-gray-400' : 'bg-gray-700'
                    ].join(' ')}
                    key={key}
                    onClick={() => onFrameworkChange(fw)}
                  >
                    {fw.label}
                  </li>
                })}
              </ul>
            </div>

            <CodeEditor
              name="result"
              value={componentString}
              readOnly
              mode={editorMode}
              onLoad={onResultLoad}
            />
          </div>
        </div>
      </main>

      <footer className="p-4 text-xs text-white">
        made by <a href="https://dimaslz.dev" className="text-gray-400 hover:text-gray-300" target="_blank">dimaslz.dev</a> · <a href="https://www.linkedin.com/in/dimaslopezzurita/" className="text-gray-400 hover:text-gray-300" target="_blank">in</a>
      </footer>

      {/* <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style> */}
    </div>
  )
}
