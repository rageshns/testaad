const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');

async function fetchWithProxy() {
  try {
    // Proxy configuration
    const proxyHost = 'YOUR_PROXY_HOST';
    const proxyPort = YOUR_PROXY_PORT;

    // Replace with the URL of the OAuth2 token endpoint
    const tokenEndpoint = 'https://oauth2-server.com/token';

    // Load your TLS/SSL certificate and private key
    const tlsCertPath = '/path/to/your/certificate.crt';
    const tlsKeyPath = '/path/to/your/private-key.key';

    // Create an HTTPS proxy agent with your proxy configuration
    const proxyAgent = new HttpsProxyAgent(`http://${proxyHost}:${proxyPort}`);

    // Define your OAuth2 request parameters
    const oauth2Params = {
      grant_type: 'client_credentials',
      client_id: 'YOUR_CLIENT_ID',
      client_secret: 'YOUR_CLIENT_SECRET',
    };

    // Perform the OAuth2 authentication request
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      body: new URLSearchParams(oauth2Params),
      agent: proxyAgent, // Use the proxy agent
      cert: fs.readFileSync(tlsCertPath),
      key: fs.readFileSync(tlsKeyPath),
      rejectUnauthorized: false, // Set to true if the certificate should be validated
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error(`OAuth2 request failed with status ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage example
fetchWithProxy()
  .then((data) => console.log('OAuth2 Response:', data))
  .catch((error) => console.error('OAuth2 Error:', error));
