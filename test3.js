const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const fs = require('fs');

async function fetchWithProxyAndTLSValidation() {
  try {
    // Proxy configuration
    const proxyHost = 'YOUR_PROXY_HOST';
    const proxyPort = YOUR_PROXY_PORT;

    // Replace with the URL of the API you want to access
    const apiUrl = 'https://api.example.com';

    // Load your TLS/SSL certificate and private key
    const tlsCertPath = '/path/to/your/certificate.crt';
    const tlsKeyPath = '/path/to/your/private-key.key';

    // Create an HTTPS proxy agent with your proxy configuration
    const proxyAgent = new HttpsProxyAgent(`http://${proxyHost}:${proxyPort}`);

    // Read the certificate and key files
    const tlsCert = fs.readFileSync(tlsCertPath);
    const tlsKey = fs.readFileSync(tlsKeyPath);

    // Perform the fetch request with proxy, certificate, and key
    const response = await fetch(apiUrl, {
      method: 'GET', // Change the HTTP method as needed
      agent: proxyAgent, // Use the proxy agent
      headers: {
        'Content-Type': 'application/json', // Set your request headers
      },
      // Configure the TLS options for certificate validation
      agent: proxyAgent,
      cert: tlsCert,
      key: tlsKey,
      ca: [tlsCert], // Specify the certificate authority (CA) for validation
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage example
fetchWithProxyAndTLSValidation()
  .then((data) => console.log('Response:', data))
  .catch((error) => console.error('Error:', error));
