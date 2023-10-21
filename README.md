# Puppeteer Extra Amazon Captcha Plugin 
A simple [`puppeteer-extra`](https://github.com/berstend/puppeteer-extra/tree/master) plugin, made possible with [Tessaract.js](https://github.com/naptha/tesseract.js). 

*Note: This plugin is still under development.*

## Installation

```bash
npm i @mihnea.dev/puppeteer-extra-amazon-captcha
```

## Usage
```typescript
import AmazonCaptchaPlugin from "@mihnea.dev/puppeteer-extra-amazon-captcha";
import puppeteer from 'puppeteer-extra';
import { Browser, Page } from "puppeteer";

let page:       Page    | undefined;
let browser:    Browser | undefined
try {
    const amazonCaptchaPlugin = AmazonCaptchaPlugin();
    puppeteer.use(amazonCaptchaPlugin);
    browser = await puppeteer.launch({
        headless: "new",
        ignoreHTTPSErrors: true,
    });
    page = await browser.newPage();
    await page.goto("https://www.amazon.com/errors/validateCaptcha");
    /** Important: Delay code execution until URL no longer includes "error" */
    await page.waitForFunction(() => !window.location.href.includes("error"));
    url = page.url();
} catch (e) {
    console.log("Error launching puppeteer: " + (<Error>e).message)
} finally {
    await page?.close();
    await browser?.close();
}
```

## License

Copyright © 2023, [Mihnea Manolache](https://github.com/mihneamanolache/). Released under the MIT License.
