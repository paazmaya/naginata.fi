/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */
const {
  chromium
} = require('playwright');

/**
 * Take a screen capture of each hover state and create a video of them
 *
 * ffmpeg -framerate 2 -i bogu-%02d.png -pix_fmt yuv420p -c:v libx264 -r 30 -g 1 bogu-hover.mp4
 */
const URL = process.env.URL || 'https://naginata.fi/en/naginata';
const IMG = '/img/naginata-bogu-chudan-artwork-lecklin.png';

const size = {
  width: 1024,
  height: 800
};

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const page = await browser.newPage({
    viewport: size,
    recordVideo: {
      dir: './videos',
      size: size
    }
  });
  await page.goto(URL);

  const p = await page.locator('p:has(img[src="' + IMG + '"])');
  await p.screenshot({
    path: 'bogu-00.png'
  });
  const spans = await p.locator('.note');

  /* eslint-disable no-await-in-loop -- Figure it out! */
  const len = await spans.count();
  for (let i = 0; i < len; ++i) {
    const span = await spans.nth(i);
    await span.hover();

    let n = String(i + 1); // because img is the first
    if (n.length < 2) {
      n = '0' + n; // zero fill needed for FFmpeg
    }
    await p.screenshot({
      path: `bogu-${n}.png`
    });
  }

  await page.close();
})();
