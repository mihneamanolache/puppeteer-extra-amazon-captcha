# Puppeteer Extra Amazon Captcha Plugin 
A simple [`puppeteer-extra`](https://github.com/berstend/puppeteer-extra/tree/master) plugin, made possible with [Tessaract.js](https://github.com/naptha/tesseract.js). 

![preview](https://github.com/mihneamanolache/puppeteer-extra-amazon-captcha/assets/43548656/46c1b13f-f319-471b-9887-7cf3aec0b51e)

*Note: This plugin is still under development and has not been tested in production.*

## Installation

```bash
npm i @mihnea.dev/puppeteer-extra-amazon-captcha
```

## Usage
```js
import AmazonCaptchaPlugin from "@mihnea.dev/puppeteer-extra-amazon-captcha";
import puppeteer from 'puppeteer-extra';
try {
    const amazonCaptchaPlugin = AmazonCaptchaPlugin.default();
    puppeteer.use(amazonCaptchaPlugin);
    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.goto("https://www.amazon.com/errors/validateCaptcha");
    /** Important: Delay code execution until URL no longer includes "error" */
    await page.waitForFunction(() => !window.location.href.includes("error"));
    await page.close();
    await browser.close();
} catch (e) {
    console.log("Error launching puppeteer: " + e.message)
}
```

## License

Copyright © 2023, [Mihnea Manolache](https://github.com/mihneamanolache/). Released under the MIT License.
