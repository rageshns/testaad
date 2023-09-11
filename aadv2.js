const fetch = require('node-fetch');
const https = require('https');
const HttpsProxyAgent = require('https-proxy-agent');
const fs = require('fs');
const querystring = require('querystring');

exports.handler = async (event, context) => {
  try {
    const proxyUrl = 'https://your-proxy-url:port'; // Replace with your Zscaler proxy URL and port
    const certPath = '/var/task/certificate.pem'; // Path to the certificate in your deployment package

    // Load the certificate from the file
    const certificate = fs.readFileSync(certPath);

    // Create a custom agent with the proxy and certificate
    const agent = new HttpsProxyAgent(proxyUrl, {
      ca: [certificate], // Specify the certificate for proxy communication
    });

    const azureTokenUrl = 'https://login.microsoftonline.com/your-tenant-id/oauth2/token'; // Replace with Azure AD token endpoint
    const clientId = 'your-client-id'; // Replace with your Azure AD application's client ID
    const clientSecret = 'your-client-secret'; // Replace with your Azure AD application's client secret
    const scope = 'https://graph.microsoft.com/.default'; // Replace with the desired scope

    const tokenRequestBody = querystring.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: scope,
    });

    const response = await fetch(azureTokenUrl, {
      method: 'POST',
      agent: agent, // Use the custom agent for proxy communication
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Azure AD Response:', data);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
