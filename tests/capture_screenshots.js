'use strict';

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function capture() {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const outputDir = path.resolve(__dirname, '../../image');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('Launching browser with puppeteer-core...');
    const browser = await puppeteer.launch({
        executablePath: edgePath,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1100 });

    console.log('Navigating to Swagger UI...');
    await page.goto('http://localhost:5000/swagger/', { waitUntil: 'networkidle0' });

    // Wait for Swagger elements to load
    await page.waitForSelector('.swagger-ui');

    const swaggerPath = path.join(outputDir, 'swagger_overview.png');
    await page.screenshot({ path: swaggerPath, fullPage: false });
    console.log(`Saved screenshot: ${swaggerPath}`);

    // Expand all operations if possible
    try {
        const expandButtons = await page.$$('.opblock-summary');
        for (let i = 0; i < Math.min(expandButtons.length, 6); i++) {
            await expandButtons[i].click();
        }
        await new Promise(r => setTimeout(r, 1000));
        const expandedPath = path.join(outputDir, 'swagger_operations_expanded.png');
        await page.screenshot({ path: expandedPath, fullPage: false });
        console.log(`Saved screenshot: ${expandedPath}`);
    } catch (e) {
        console.warn('Could not expand operations:', e.message);
    }

    await browser.close();
    console.log('Screenshots captured successfully!');
}

capture().catch(console.error);
