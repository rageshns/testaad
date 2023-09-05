# testaad

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import javax.net.ssl.HttpsURLConnection;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.security.KeyStore;
import java.security.cert.X509Certificate;

public class AzureADTokenLambda implements RequestHandler<Object, String> {

    @Override
    public String handleRequest(Object input, Context context) {
        try {
            // Azure AD OAuth2 token endpoint
            String tokenEndpoint = "https://login.microsoftonline.com/YOUR_TENANT_ID/oauth2/token";
            
            // Azure AD client ID and client secret
            String clientId = "YOUR_CLIENT_ID";
            String clientSecret = "YOUR_CLIENT_SECRET";

            // Load your SSL keystore
            KeyStore keystore = KeyStore.getInstance("JKS");
            InputStream keystoreInputStream = getClass().getResourceAsStream("/your-keystore.jks");
            String keystorePassword = "your_keystore_password"; // Change this to your keystore password
            keystore.load(keystoreInputStream, keystorePassword.toCharArray());

            // Create an SSLContext with the keystore
            X509Certificate certificate = (X509Certificate) keystore.getCertificate("your_certificate_alias");
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, new X509Certificate[]{certificate}, null);

            // Set the custom SSLContext for HTTPS connections
            HttpsURLConnection.setDefaultSSLSocketFactory(sslContext.getSocketFactory());

            // Create an HTTP POST request to the token endpoint
            URL url = new URL(tokenEndpoint);
            HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);

            // Add OAuth2 token request parameters
            String tokenRequestParams = "grant_type=client_credentials" +
                    "&client_id=" + clientId +
                    "&client_secret=" + clientSecret +
                    "&scope=https://graph.microsoft.com/.default"; // Adjust the scope as needed

            // Write the token request parameters to the request body
            try (OutputStream os = connection.getOutputStream()) {
                byte[] inputBytes = tokenRequestParams.getBytes("UTF-8");
                os.write(inputBytes, 0, inputBytes.length);
            }

            // Read the response from the Azure AD token endpoint
            InputStream responseInputStream = connection.getInputStream();
            byte[] responseBytes = responseInputStream.readAllBytes();
            String response = new String(responseBytes);

            // Close the connection
            connection.disconnect();

            return response;
        } catch (Exception e) {
            // Handle exceptions appropriately in your Lambda function
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}
