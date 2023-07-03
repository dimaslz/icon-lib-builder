import { expect, test } from '@playwright/test';
import fs from 'fs';


test('Converts to React component', async ({ page }) => {
  // console.log('buffer', __dirname);
  const buffer = fs.readFileSync(`${__dirname}/dummy.svg`, { encoding: 'utf8' });

  // console.log('buffer', buffer);
  // Create the DataTransfer and File

  await test.step('Go to page', async () => {
    await page.goto('https://svg-icon-2-fw-component.dimaslz.dev');
    // await page.goto('http://localhost:3000');
  });

  // const loading = await page.waitForSelector('#Loading');
  await test.step('Loading is done', async () => {
    await page.getByTestId('Loading').waitFor({ state: 'hidden' });

    await page.waitForSelector('div.Source #source .ace_text-layer');
    await page.waitForSelector('div.Result #result .ace_text-layer');
  });

  const dataTransfer = await page.evaluateHandle((data) => {
    const dt = new DataTransfer();
    // Convert the buffer to a hex array
    const file = new File([data.toString()], 'dummy.svg', { type: 'image/svg+xml' });
    dt.items.add(file);
    return dt;
  }, buffer);

  await test.step('Can see text drag and drop layer', async () => {
    // Now dispatch
    await page.dispatchEvent('div.Source', 'dragenter', { dataTransfer });

    await expect(await page.getByText('drop file here')).toBeVisible();
  });

  await test.step('Drop file', async () => {
    await page.dispatchEvent('div.Source', 'drop', { dataTransfer });

    await expect(await page.getByText('drop file here')).not.toBeVisible();
    await page.waitForTimeout(1000);
  });

  await test.step('SVG Editor has the expected content', async () => {
    await page.waitForSelector('div.Source #source .ace_text-layer');

    await expect((await page.textContent('div.Source #source .ace_text-layer'))).toBe('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">  <path    fill="none"    stroke="#000"    stroke-linecap="round"    stroke-linejoin="round"    d="m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76"  /></svg>');
  });

  await test.step('Component Editor has the expected content (React js-v1)', async () => {
    await page.waitForSelector('div.Result #result .ace_text-layer');

    await expect((await page.textContent('div.Result #result .ace_text-layer'))).toBe('import * as React from "react";const Icon = ({ size = 24, stroke = 1, style = {}, className }) => {  return (    <svg      className={className}      xmlns="http://www.w3.org/2000/svg"      viewBox="0 0 14 14"      style={{        width: `${size}px`,        height: `${size}px`,        strokeWidth: `${stroke}px`,        ...style,      }}    >      <path        fill="none"        stroke="currentColor"        d="m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76"        strokeLinecap="round"        strokeLinejoin="round"      ></path>    </svg>  );};export default Icon;');
  });


  await test.step('Component Editor has the expected content (React js-v2)', async () => {
    (await page.getByText('Javascript v2')).click();
    await page.waitForTimeout(1000);

    await expect((await page.textContent('div.Result #result .ace_text-layer'))).toBe('import * as React from "react";function Icon({ size = 24, stroke = 1, style = {}, className }) {  return (    <svg      className={className}      xmlns="http://www.w3.org/2000/svg"      viewBox="0 0 14 14"      style={{        width: `${size}px`,        height: `${size}px`,        strokeWidth: `${stroke}px`,        ...style,      }}    >      <path        fill="none"        stroke="currentColor"        d="m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76"        strokeLinecap="round"        strokeLinejoin="round"      ></path>    </svg>  );}export default Icon;');
  });
});
