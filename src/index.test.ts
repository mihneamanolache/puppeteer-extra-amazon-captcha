import { assert } from "chai";

import AmazonCaptchaPlugin from "../src/index";
import puppeteer from 'puppeteer-extra';
import { Browser, Page } from "puppeteer";

describe("Should pass Amazon captcha", function () {
    it("Use AmazonCaptchaPlugin", async function () {
        const chromium_args: string[] = [
            '--no-sandbox',
            '--no-zygote',
            '--disable-gpu',
            '--ignore-certificate-errors',
            '--allow-running-insecure-content',
            '--disable-web-security',
        ];
        let url:        string  | undefined;
        let page:       Page    | undefined;
        let browser:    Browser | undefined
        try {
            const amazonCaptchaPlugin = AmazonCaptchaPlugin();
            puppeteer.use(amazonCaptchaPlugin);
            browser = await puppeteer.launch({
                headless: "new",
                ignoreHTTPSErrors: true,
                args: chromium_args,
            });
            page = await browser.newPage();
            await page.goto("https://www.amazon.com/errors/validateCaptcha");
            await page.waitForFunction(() => !window.location.href.includes("error"));
            url = page.url();
        } catch (e) {
            console.log("Error launching puppeteer: " + (<Error>e).message)
        } finally {
            await page?.close();
            await browser?.close();
        }
        assert.notInclude(url, "errors");
    });
});

