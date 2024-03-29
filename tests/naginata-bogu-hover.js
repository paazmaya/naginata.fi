/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */
const {
  firefox
} = require('playwright');

/**
 * Take a screen capture of each hover state and create a video of them
 *
ffmpeg -r 2 -i bogu-%02d.png -pix_fmt yuv420p \
 -vf "crop=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx265 -b:v 2000k \
 -an -r 15 -g 1 bogu-hover.mp4

Input file framerate is 2, while the output framerate is 15.
 */
const URL = process.env.URL || 'https://naginata.fi/en/naginata';
const IMG = '/img/naginata-bogu-chudan-artwork-lecklin.png';

const size = {
  width: 1024,
  height: 800
};
let imageCounter = 0;

const takeShot = (img) => {
  let n = String(imageCounter + 1); // because img is the first
  if (n.length < 2) {
    n = '0' + n; // zero fill needed for FFmpeg
  }
  imageCounter++; // prepare for next

  return img.screenshot({
    path: `bogu-${n}.png`,
    scale: 'css'
  });
};

const hoverSpans = async (spans, img) => {
  await takeShot(img); // first one is without hover

  /* eslint-disable no-await-in-loop -- Figure it out! */
  const len = await spans.count();
  for (let i = 0; i < len; ++i) {
    const span = await spans.nth(i);

    await span.hover();
    await takeShot(img);

    await span.blur();
    await takeShot(img);
  }
};

(async () => {
  const browser = await firefox.launch({
    headless: false
  });
  const page = await browser.newPage({
    viewport: size
  });
  await page.goto(URL);

  const p = await page.locator('p:has(img[src="' + IMG + '"])');
  const spans = await p.locator('.note');
  const img = await p.locator('img[src="' + IMG + '"]');
  await hoverSpans(spans, img);

  await page.close();
  await browser.close();
})();
