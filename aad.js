const fetch = require('node-fetch');
const https = require('https');
const HttpsProxyAgent = require('https-proxy-agent');
const fs = require('fs');

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

    const url = 'https://login.microsoftonline.com/your-tenant-id/oauth2/token'; // Replace with Azure AD token endpoint
    const response = await fetch(url, {
      method: 'POST',
      agent: agent, // Use the custom agent for proxy communication
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // Add your Azure AD token request parameters
      // Example: body: 'grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret&scope=https://graph.microsoft.com/.default'
      // Also, adjust the request body and headers as per your needs
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Response:', data);

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
