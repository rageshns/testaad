const fetch = require('node-fetch');
const querystring = require('querystring');

exports.handler = async (event, context) => {
  try {
    // Get Azure AD configuration from environment variables
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const scope = process.env.SCOPE;
    const tokenEndpoint = 'https://login.microsoftonline.com/<your-tenant-id>/oauth2/token'; // Replace with your Azure AD tenant ID

    // Create the token request body
    const tokenRequestBody = querystring.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: scope,
    });

    // Send a POST request to Azure AD token endpoint
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const tokenData = await response.json();
    console.log('Azure AD Response:', tokenData);

    return {
      statusCode: 200,
      body: JSON.stringify(tokenData),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};


///v2

const fetch = require('node-fetch');
const querystring = require('querystring');

exports.handler = async (event, context) => {
  try {
    // Get Azure AD configuration from environment variables
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const scope = process.env.SCOPE;
    const tokenEndpoint = 'https://login.microsoftonline.com/<your-tenant-id>/oauth2/token'; // Replace with your Azure AD tenant ID

    // Create the token request body
    const tokenRequestBody = querystring.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: scope,
    });

    // Set proxy options
    const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY; // Get the proxy URL from environment variables
    const proxyAgent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : null; // Create a proxy agent if a proxy URL is provided

    // Send a POST request to Azure AD token endpoint with proxy agent
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody,
      agent: proxyAgent, // Use the proxy agent for requests
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const tokenData = await response.json();
    console.log('Azure AD Response:', tokenData);

    return {
      statusCode: 200,
      body: JSON.stringify(tokenData),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
