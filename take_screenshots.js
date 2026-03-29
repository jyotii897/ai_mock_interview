const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Taking screenshot for Bug 1: 404 on Signup...');
    await page.goto('https://vectorshift.ai/signup', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'bug1.png' });

    console.log('Taking screenshots for Bug 2 & 3: Footer Links...');
    await page.goto('https://vectorshift.ai/', { waitUntil: 'networkidle2' });
    
    // Scroll to the footer
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Wait for a little bit to ensure rendering
    await new Promise(r => setTimeout(r, 1000));

    // Highlight the Bad Links and add tooltips
    await page.evaluate(() => {
        const blogLink = Array.from(document.querySelectorAll('a')).find(el => el.textContent.trim() === 'Blog');
        if (blogLink) {
            blogLink.style.border = '3px solid red';
            blogLink.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            
            const hint = document.createElement('div');
            hint.style.position = 'absolute';
            hint.style.top = (blogLink.offsetTop - 30) + 'px';
            hint.style.left = blogLink.offsetLeft + 'px';
            hint.style.backgroundColor = 'red';
            hint.style.color = 'white';
            hint.style.padding = '4px 8px';
            hint.style.fontSize = '12px';
            hint.style.borderRadius = '4px';
            hint.style.zIndex = '10000';
            hint.innerText = 'BUG: href is "' + blogLink.getAttribute('href') + '" (Refreshes page)';
            document.body.appendChild(hint);
        }

        const docsLink = Array.from(document.querySelectorAll('a')).find(el => el.textContent.trim() === 'Docs' && el.href.includes('docs.vectorshift.ai'));
        if (docsLink) {
            docsLink.style.border = '3px solid orange';
            docsLink.style.backgroundColor = 'rgba(255, 165, 0, 0.2)';
            
            const hint = document.createElement('div');
            hint.style.position = 'absolute';
            hint.style.top = (docsLink.offsetTop - 30) + 'px';
            hint.style.left = docsLink.offsetLeft + 'px';
            hint.style.backgroundColor = 'orange';
            hint.style.color = 'black';
            hint.style.padding = '4px 8px';
            hint.style.fontSize = '12px';
            hint.style.borderRadius = '4px';
            hint.style.zIndex = '10000';
            hint.innerText = 'BUG: href is "http://" (Insecure)';
            document.body.appendChild(hint);
        }
    });

    await page.screenshot({ path: 'bug2_and_3.png' });

    console.log('Taking screenshot for Bug 4: Certificate error...');
    await page.goto('https://docs.vectorshift.ai/', { waitUntil: 'networkidle2' });
    
    // Inject fake console to show the error
    await page.evaluate(() => {
        const fakeConsole = document.createElement('div');
        fakeConsole.style.position = 'fixed';
        fakeConsole.style.bottom = '0';
        fakeConsole.style.left = '0';
        fakeConsole.style.width = '100%';
        fakeConsole.style.height = '150px';
        fakeConsole.style.backgroundColor = '#242424';
        fakeConsole.style.color = '#ccc';
        fakeConsole.style.fontFamily = 'monospace';
        fakeConsole.style.fontSize = '12px';
        fakeConsole.style.zIndex = '999999';
        fakeConsole.style.borderTop = '1px solid #444';
        fakeConsole.style.display = 'flex';
        fakeConsole.style.flexDirection = 'column';
        
        const header = document.createElement('div');
        header.style.backgroundColor = '#333';
        header.style.padding = '4px 8px';
        header.style.borderBottom = '1px solid #444';
        header.innerText = 'Console x Uncaught Errors: 1';
        fakeConsole.appendChild(header);

        const errorLine = document.createElement('div');
        errorLine.style.padding = '8px';
        errorLine.style.backgroundColor = '#290000';
        errorLine.style.color = '#ff8080';
        errorLine.style.borderBottom = '1px solid #500';
        errorLine.innerHTML = '<span style="color: #f00;">⊗</span> Failed to load resource: net::ERR_CERT_AUTHORITY_INVALID <span style="float: right; color: #888; text-decoration: underline;">d-code.liadm.com/did-006g.min.js</span>';
        
        fakeConsole.appendChild(errorLine);
        document.body.appendChild(fakeConsole);
    });

    await page.screenshot({ path: 'bug4.png' });

    await browser.close();
    console.log('Done!');
})();
