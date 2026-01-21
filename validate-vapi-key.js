const https = require('https');

const VAPI_PUBLIC_KEY = "vapi-public-c1ee9545-be52-4663-aa49-9dfc2f92b4a0";

const options = {
    hostname: 'api.vapi.ai',
    path: '/assistant',
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${VAPI_PUBLIC_KEY}`,
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);

    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('BODY:', data);
        if (res.statusCode === 401) {
            console.log("❌ KEY IS INVALID (401)");
        } else if (res.statusCode === 200) {
            console.log("✅ KEY IS VALID (200)");
        } else {
            console.log("⚠️ UNKNOWN STATUS");
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
