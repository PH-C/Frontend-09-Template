const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.baidu.com');
  await page.screenshot({ path: 'example.png' });
  const head = await page.$('#head')
  console.log(await head.asElement().boxModel())

  await browser.close();
})();