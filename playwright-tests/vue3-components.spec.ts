import { expect, test } from '@playwright/test';
import fs from 'fs';


test.use({ viewport: { width: 1024, height: 1000 } });

test('Converts to Vue3 component', async ({ page }) => {
  const buffer = fs.readFileSync(`${__dirname}/files/dummy.svg`, { encoding: 'utf8' });

  await test.step('Go to page', async () => {
    await page.goto('/');
  });

  await test.step('Loading is done', async () => {
    await page.getByTestId('Loading').waitFor({ state: 'detached' });
  });

  const dataTransfer = await page.evaluateHandle((data) => {
    const dt = new DataTransfer();
    const file = new File([data.toString()], 'dummy.svg', { type: 'image/svg+xml' });
    dt.items.add(file);
    return dt;
  }, buffer);

  await test.step('Can see text drag and drop layer', async () => {
    await page.waitForSelector('[data-testid=workzone]');

    await page.dispatchEvent('div.Source', 'dragenter', { dataTransfer });

    expect(await page.getByText('drop file here')).toBeVisible();
  });

  await test.step('Drop file', async () => {
    await page.dispatchEvent('div.Source', 'drop', { dataTransfer });

    const dropLayerElement = await page.getByText('drop file here');
    await dropLayerElement.waitFor({ state: 'detached' });

    await expect(dropLayerElement).not.toBeVisible();
  });

  await test.step('SVG Editor has the expected content', async () => {
    await page.waitForTimeout(500);

    const content = (await page.textContent('div.Source .view-lines'));

    const expected = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">  <path    fill="none"    stroke="#000"    stroke-linecap="round"    stroke-linejoin="round"    d="m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76"  /></svg>';

    expect(content?.replace(/\s/g, ' ')).toBe(expected);
  });

  await test.step('Click on Vue3 framework', async () => {
    const vue3Button = await page.getByRole('tab', { name: /^vue 3 framework/i });
    (await vue3Button).click();
    await page.waitForTimeout(500);

    expect(await page.getByRole(
      'tab',
      { name: /^vue 3 framework/i, selected: true }),
    ).toBeVisible();
  });

  await test.step('Component Editor has the expected content (Vue3 javascript)', async () => {
    const content = (await page.textContent('div.Result .view-lines'));

    const expected = '<template>  <svg    xmlns="http://www.w3.org/2000/svg"    viewBox="0 0 14 14"    :style="{      width: `${size}px`,      height: `${size}px`,      strokeWidth: `${stroke}`,    }"  >    <path      fill="none"      stroke="currentColor"      stroke-linecap="round"      stroke-linejoin="round"      d="m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76"    ></path>  </svg></template><script>export default {  name: "Icon",  props: {    size: {      type: [Number, String],      default: 24,    },    stroke: {      type: [Number, String],      default: 1,    },  },};</script>';

    expect(content?.replace(/\s/g, ' ')).toBe(expected);
  });

  await test.step('Component Editor has the expected content (Vue3 typescript)', async () => {
    (await page.getByText('TypeScript')).click();
    await page.waitForTimeout(500);

    const content = (await page.textContent('div.Result .view-lines'));

    const expected = '<template>  <svg    xmlns="http://www.w3.org/2000/svg"    viewBox="0 0 14 14"    :style="{      width: `${size}px`,      height: `${size}px`,      strokeWidth: `${stroke}`,    }"  >    <path      fill="none"      stroke="currentColor"      stroke-linecap="round"      stroke-linejoin="round"      d="m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76"    ></path>  </svg></template><script lang="ts">import { defineComponent } from "vue";export default defineComponent({  name: "Icon",  props: {    size: {      type: [Number, String],      default: 24,    },    stroke: {      type: [Number, String],      default: 1,    },  },});</script>';

    expect(content?.replace(/\s/g, ' ')).toBe(expected);
  });

  await test.step('Component Editor has the expected content (Vue3 typescript)', async () => {
    (await page.getByText('TS Compressed')).click();
    await page.waitForTimeout(500);

    const content = (await page.textContent('div.Result .view-lines'));

    const expected = '<script setup lang="ts">defineProps<{ size: number | string; stroke: number | string }>();</script><template>  <svg    xmlns="http://www.w3.org/2000/svg"    viewBox="0 0 14 14"    :style="{      width: `${size}px`,      height: `${size}px`,      strokeWidth: `${stroke}`,    }"  >    <path      fill="none"      stroke="currentColor"      stroke-linecap="round"      stroke-linejoin="round"      d="m13 6.81-5.95 6a2.48 2.48 0 0 1-3.54 0L1.73 11a2.53 2.53 0 0 1 0-3.55l6.34-6.36a2 2 0 0 1 2.84 0l.71.71a2 2 0 0 1 0 2.84L6 10.28a1 1 0 0 1-1.42 0l-.35-.36a1 1 0 0 1 0-1.42L8 4.76"    ></path>  </svg></template>';

    expect(content?.replace(/\s/g, ' ')).toBe(expected);
  });
});
