const fetch = require('node-fetch');
const fs = require('fs');
const https = require('https');

async function makeHttpsRequest() {
    try {
        const certPath = '/path/to/your/certificate.crt';
        const keyPath = '/path/to/your/private-key.key';
        const url = 'https://example.com/api';

        const cert = fs.readFileSync(certPath);
        const key = fs.readFileSync(keyPath);

        const agent = new https.Agent({
            cert,
            key,
            rejectUnauthorized: true, // Enforce certificate validation
        });

        const response = await fetch(url, {
            method: 'GET', // Adjust the HTTP method as needed
            agent,
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.text();
        console.log('Response:', data);

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Usage example
makeHttpsRequest()
    .then((data) => console.log('Request successful:', data))
    .catch((error) => console.error('Request failed:', error));
