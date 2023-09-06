const fetch = require('node-fetch');
const https = require('https');
const tls = require('tls');
const fs = require('fs');

async function fetchData() {
  try {
    // Load your X.509 certificate (no private key)
    const certPath = '/path/to/your-certificate.crt'; // Replace with the actual certificate path
    const certificate = fs.readFileSync(certPath);

    // Create a custom secure context with your certificate
    const customSecureContext = tls.createSecureContext({
      cert: certificate,
    });

    // Create a custom HTTPS agent with the secure context
    const customAgent = new https.Agent({
      keepAlive: true, // Set agent options as needed
      secureContext: customSecureContext,
    });

    const url = 'https://example.com/api';
    const response = await fetch(url, {
      method: 'GET', // Adjust the HTTP method as needed
      agent: customAgent, // Use the custom HTTPS agent
      headers: {
        'Content-Type': 'application/json', // Set your request headers
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Response:', data);

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage example
fetchData()
  .then((data) => console.log('Request successful:', data))
  .catch((error) => console.error('Request failed:', error));
