import 'tailwindcss/tailwind.css';

import Head from 'next/head';
import React, { useState } from 'react';
import isSvg from 'is-svg';
import _ from 'lodash';


import FullScreenLoading from '../components/full-screen-loading';
import Icon from '../components/icon';
import CodeEditor from '../components/code-editor';
import DropZoneComponent from '../components/drop-zone.component';

import downloadFile from '../utils/download';
import autoDownload from '../utils/auto-download';
import readFile from '../utils/read-file.utils';

import CopyToClipboard from '../utils/copy-to-clipboard';

const API_URL = process.env.API_URL;

type FileToUpload = {
  content?: string;
  name?: string;
  framework?: string;
  script?: string;
};

type Framework = {
  framework: string;
  label: string;
  mode: string;
}
export default function Home(): JSX.Element {
  const [svgString, setSvgString] = useState("// paste your SVG here");
  const [componentString, setComponentString] = useState("");
  const [framework, setFramework] = useState("react");
  const [editorMode, setEditorMode] = useState("javascript");
  const [sourceEditorReady, setSourceEditorReady] = useState(false);
  const [resultEditorReady, setResultEditorReady] = useState(false);
  const [filesDropped, setFilesDropped] = useState<File[]>([]);

  const isBrowser = (process as any).browser;

  const frameworks: Framework[] = [
    { label: 'React', framework: 'react', mode: 'javascript' },
    { label: 'Preact', framework: 'preact', mode: 'javascript' },
    { label: 'Vue 2/3', framework: 'vue', mode: 'javascript' },
    { label: 'Angular +2', framework: 'angular', mode: 'typescript' },
  ];

  async function onChange(value: string): Promise<string | void> {
    if (!isSvg(value)) return; // TODO: Send Notification error

    let svgFormatted = await httpFormatCode(value, 'svg');
    svgFormatted = svgFormatted.replace(/>;/g, '>');
    svgFormatted = svgFormatted.trim();
    setSvgString(svgFormatted);

    const script = await httpFormatCode(svgFormatted, framework);
    setComponentString(script);
  }

  async function onFrameworkChange(fw: Framework) {
    setFramework(fw.framework);
    setEditorMode(fw.mode);

    const script = await httpFormatCode(svgString, fw.framework);
    setComponentString(script)
  }

  async function httpFormatCode(script: string, fw?: string): Promise<string> {
    return await fetch(`${API_URL}/formatter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script,
        framework: fw || framework,
      }),
    }).then(i => i.json())
    .then(({ code }) => code);
  }

  function onClickCopyResult() {
    CopyToClipboard(componentString);
  }

  async function handleDrop($event: Event, files: FileList) {
    if (!isBrowser) return;

    $event.preventDefault();
    $event.stopPropagation();

    const isMultiple = files.length > 1;
    if (isMultiple) {
      const arrFiles = Array.from(files);
      setSvgString('');
      setComponentString('');
      setFilesDropped([...arrFiles]);

      return;
    }

    setFilesDropped([]);
    const file = files[0];
    const value = await readFile(file);

    if (!isSvg(value)) return; // TODO: Send Notification error

    let svgFormatted = await httpFormatCode(value, 'svg');
    svgFormatted = svgFormatted.replace(/>;/g, '>');
    setSvgString(svgFormatted);

    const script = await httpFormatCode(svgFormatted, framework);
    setComponentString(script);
  }

  async function downloadURL(filename: string) {
    const url = `${API_URL}/download/${filename}`;
    const blob = await downloadFile(url);

    autoDownload(blob, filename);
    setFilesDropped([]);
  }

  async function downloadWithFramework(fw: Framework) {
    const filesContent: FileToUpload[] = (await Promise.all(
      filesDropped.map(async (file: File) => {
        let value = await readFile(file);
        return {
          name: file.name,
          svg: value,
        };
      })
    )).filter(i => i);

    if (filesContent.length) {
      const filesUploaded: any = await uploadFiles(filesContent, fw.framework);
      downloadURL(filesUploaded?.file);
    }
  }

  function uploadFiles(files: FileToUpload[], framework: string) {
    return fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files,
        framework,
      }),
    }).then(response => response.json());
  }

  return (
    <div
      className="w-full my-0 mx-auto h-screen flex flex-col justify-start items-center bg-gray-600"
    >
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
          <DropZoneComponent onDrop={handleDrop}>
            {filesDropped.length > 0
              ? <div style={{ backgroundColor: '#3C4451' }} className="text-gray-200 h-full p-4 text-sm font-normal">
                {filesDropped.map((file: File, key: number) => <div key={key}>{file.name}</div>)}
              </div>
              : (
                <CodeEditor
                  name="source"
                  onChange={_.debounce(onChange, 200)}
                  value={svgString}
                  onLoad={() => setSourceEditorReady(true)}
                />
              )
            }
          </DropZoneComponent>
          <div className={[
            "Result w-full pl-4 h-full flex flex-col",
            (!componentString && !filesDropped.length) ? 'pointer-events-none opacity-50' : ''
          ].join(' ')} suppressHydrationWarning={true}>
            {filesDropped.length
              ? <div
                style={{ backgroundColor: '#3C4451' }}
                className={[
                  "text-gray-200 h-full p-4 text-sm font-normal",
                  filesDropped.length ? "flex flex-col items-center justify-center" : ""
                ].join(' ')}
              >
                <ul className="flex flex-col">
                  {frameworks.map((fw, key) => {
                    return <li
                      className={[
                        "mx-1 p-4 rounded-full hover:bg-gray-500 cursor-pointer my-2 bg-gray-700",
                      ].join(' ')}
                      key={key}
                      onClick={() => downloadWithFramework(fw)}
                    >
                      download for {fw.label.toUpperCase()}
                    </li>
                  })}
                </ul>
              </div> : (
                <div className="flex flex-col h-full">
                  {componentString && <button
                    onClick={onClickCopyResult}
                    className="px-3 py-2 rounded-sm absolute right-10 top-20 z-10 bg-gray-900 text-white hover:opacity-70 focus:outline-none"
                  >
                    copy
                  </button>}

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
                  <div className="h-full">
                    <CodeEditor
                      name="result"
                      value={componentString}
                      readOnly
                      mode={editorMode}
                      onLoad={() => setResultEditorReady(true)}
                    />
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </main>

      <footer className="p-4 text-xs text-white">
        made by <a
          href="https://dimaslz.dev"
          className="text-gray-400 hover:text-gray-300"
          target="_blank"
        >
          dimaslz.dev
        </a> · <a
          href="https://www.linkedin.com/in/dimaslopezzurita/"
          className="text-gray-400 hover:text-gray-300"
          target="_blank"
        >
          in
        </a>
      </footer>
    </div>
  )
}
