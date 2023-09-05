import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.azure.identity.TokenCredential;
import com.azure.identity.TokenRequestContext;

import javax.net.ssl.HttpsURLConnection;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.Proxy;
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

            // Load your JKS keystore
            KeyStore keystore = KeyStore.getInstance("JKS");
            InputStream keystoreInputStream = getClass().getResourceAsStream("/your-keystore.jks");
            String keystorePassword = "your_keystore_password"; // Change this to your keystore password
            keystore.load(keystoreInputStream, keystorePassword.toCharArray());

            // Create an X509Certificate from the keystore
            String certificateAlias = "your_certificate_alias"; // Change this to your certificate alias
            X509Certificate certificate = (X509Certificate) keystore.getCertificate(certificateAlias);

            // Create an SSLContext with the certificate
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, new X509Certificate[]{certificate}, null);

            // Set the custom SSLContext for HTTPS connections
            HttpsURLConnection.setDefaultSSLSocketFactory(sslContext.getSocketFactory());

            // Define the scope for the token request (resource you want to access)
            String scope = "https://management.azure.com/.default"; // Example scope for Azure Management API

            // Create a TokenRequestContext with the scope
            TokenRequestContext tokenRequestContext = new TokenRequestContext().addScopes(scope);

            // Configure proxy settings (if required)
            String proxyHost = "YOUR_PROXY_HOST";
            int proxyPort = 8080; // Change this to your proxy port

            // Create a Proxy instance
            Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(proxyHost, proxyPort));

            // Set system properties for HTTP and HTTPS proxy hosts and ports
            System.setProperty("http.proxyHost", proxyHost);
            System.setProperty("http.proxyPort", String.valueOf(proxyPort));
            System.setProperty("https.proxyHost", proxyHost);
            System.setProperty("https.proxyPort", String.valueOf(proxyPort));

            // Create a ClientSecretCredential for Azure Identity
            TokenCredential tokenCredential = new ClientSecretCredentialBuilder()
                    .tenantId("YOUR_TENANT_ID")
                    .clientId(clientId)
                    .clientSecret(clientSecret)
                    .proxy(proxy) // Set the proxy
                    .build();

            // Use the tokenCredential to get an access token
            String accessToken = tokenCredential.getToken(tokenRequestContext).block().getToken();

            // You can now use the access token for your API requests
            return "Access Token: " + accessToken;
        } catch (Exception e) {
            // Handle exceptions appropriately in your Lambda function
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}
