const fetch = require('node-fetch');
const httpsProxyAgent = require('https-proxy-agent');
const tls = require('tls');
const fs = require('fs');

async function connectWithProxyAndTLS() {
  try {
    // Define proxy server details
    const proxyHost = 'YOUR_PROXY_HOST';
    const proxyPort = YOUR_PROXY_PORT;

    // Define target URL
    const targetUrl = 'https://example.com';

    // Load your X.509 certificate (no private key)
    const certPath = '/path/to/your/certificate.crt';

    const cert = fs.readFileSync(certPath);

    // Create a custom TLS context with only the certificate
    const customTlsContext = tls.createSecureContext({ cert });

    // Create an HTTPS proxy agent with your proxy server details
    const proxyAgent = new httpsProxyAgent(`http://${proxyHost}:${proxyPort}`);

    // Create a fetch configuration object
    const fetchConfig = {
      method: 'GET', // Adjust the HTTP method as needed
      agent: proxyAgent, // Use the proxy agent
      headers: {
        'User-Agent': 'My App', // Set user-agent as needed
      },
      // Specify your custom TLS context for the request
      agent: {
        https: customTlsContext,
      },
    };

    // Make the fetch request
    const response = await fetch(targetUrl, fetchConfig);

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
connectWithProxyAndTLS()
  .then((data) => console.log('Request successful:', data))
  .catch((error) => console.error('Request failed:', error));
