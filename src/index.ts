import { createWorker } from 'tesseract.js';
import { PuppeteerExtraPlugin } from 'puppeteer-extra-plugin'
import { HTTPRequest, HTTPResponse, Page } from 'puppeteer'

export interface PuppeteerExtraPluginAmazonCaptchaOptions {
    /** Maximum number of retries (sometimes tessaract fails) */
    maxRetries:     number;
    /** Amazon input field selector */
    inputSelector:  string;
}

export class PuppeteerExtraPluginAmazonCaptcha extends PuppeteerExtraPlugin {

    constructor(opts: Partial<PuppeteerExtraPluginAmazonCaptchaOptions>) {
        super(opts)
    }

    get name() {
        return "amazon-captcha"
    }

    get defaults(): PuppeteerExtraPluginAmazonCaptchaOptions {
        return {
            maxRetries:     30,
            inputSelector:  "#captchacharacters"
        }
    }

    protected async _solveAmazonCaptcha(page: Page, url: string): Promise<void> {
        const worker = await createWorker("eng");
        const captcha = await worker.recognize(url);
        await page.type(this.opts.inputSelector, captcha.data.text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase());
        await page.keyboard.press('Enter');
        await worker.terminate();
    }

    async onPageCreated(page: Page): Promise<void> {
        var retry = 0;
        page.waitForNavigation({
            timeout: this.opts.maxWait
        });
        await page.setRequestInterception(true); 
        page.on("request", (req: HTTPRequest) => {
            req.continue();
        })
        page.on("response", async (res: HTTPResponse) => {
            const req: HTTPRequest  = res.request();
            const url: string       = req.url();
            if ( 
                url.toLowerCase().includes("amazon") && 
                url.toLowerCase().includes("captcha") && 
                req.resourceType() === "image"  &&
                retry <= this.opts.maxRetries ) 
            {
                this._solveAmazonCaptcha(page, url);
                retry++;
            }
        });
    }
}

/** Default export, PuppeteerExtraPluginAmazonCaptcha */
const defaultExport = (options?: Partial<any>) => {
  return new PuppeteerExtraPluginAmazonCaptcha(options || {})
}

export default defaultExport
