const fetch = require('node-fetch');
const ProxyAgent = require('https-proxy-agent');
const fs = require('fs');

exports.handler = async (event, context) => {
    // Zscaler Proxy Configuration
    const proxyURL = 'https://your-zscaler-proxy-url.com:port'; // Replace with your Zscaler proxy URL and port
    const certPath = '/path/to/your/certificate.pem'; // Replace with the path to your X.509 certificate file
    const agent = new ProxyAgent({
        protocol: 'https:',
        host: 'your-zscaler-proxy-url.com',
        port: 'port',
        ca: fs.readFileSync(certPath), // Load your X.509 certificate
    });

    // Azure AD Token Request Configuration
    const azureADTokenEndpoint = 'https://login.microsoftonline.com/your-tenant-id/oauth2/token'; // Replace with your Azure AD endpoint
    const clientId = 'your-client-id'; // Replace with your Azure AD application's client ID
    const clientSecret = 'your-client-secret'; // Replace with your Azure AD application's client secret
    const scope = 'https://graph.microsoft.com/.default'; // Replace with your desired scope

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const body = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}&scope=${scope}`;

    try {
        const response = await fetch(azureADTokenEndpoint, {
            method: 'POST',
            headers,
            body,
            agent, // Use the Zscaler proxy agent with the X.509 certificate for the request
        });

        if (response.status !== 200) {
            return {
                statusCode: response.status,
                body: 'Failed to retrieve Azure AD token',
            };
        }

        const tokenData = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(tokenData),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
