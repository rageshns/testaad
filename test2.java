import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
//https://github.com/aws-samples/serverless-mutual-tls/blob/cd78735b4490df6361481bc20ea842c548e86419/software/3-lambda-using-parameter-store/src/main/java/com/amazon/aws/example/AppClient.java#L13
import javax.net.ssl.*;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.Enumeration;

public class SSLContextLambda implements RequestHandler<Object, String> {

    @Override
    public String handleRequest(Object input, Context context) {
        try {
            // Load your keystore with the TLS certificate and private key
            String keystorePath = "/path/to/your-keystore.jks";
            String keystorePassword = "your_keystore_password";
            KeyStore keystore = KeyStore.getInstance("JKS");
            InputStream keystoreInputStream = getClass().getResourceAsStream(keystorePath);
            keystore.load(keystoreInputStream, keystorePassword.toCharArray());

            // Create an SSLContext
            SSLContext sslContext = SSLContext.getInstance("TLS");

            // Initialize the SSLContext with your keystore
            KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
            keyManagerFactory.init(keystore, keystorePassword.toCharArray());

            // Initialize a TrustManager that trusts all certificates (for simplicity)
            TrustManager[] trustManagers = {new X509TrustManager() {
                public X509Certificate[] getAcceptedIssuers() {
                    return null;
                }
                public void checkClientTrusted(X509Certificate[] certs, String authType) {
                }
                public void checkServerTrusted(X509Certificate[] certs, String authType) {
                }
            }};

            // Initialize the SSLContext with KeyManagers and TrustManagers
            sslContext.init(keyManagerFactory.getKeyManagers(), trustManagers, new SecureRandom());

            // Create an SSL socket factory from the SSLContext
            SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();

            // You can now use the sslSocketFactory to establish an SSL connection

            // For demonstration, print the aliases in the keystore
            Enumeration<String> aliases = keystore.aliases();
            while (aliases.hasMoreElements()) {
                String alias = aliases.nextElement();
                context.getLogger().log("Alias in Keystore: " + alias);
            }

            return "SSLContext initialization successful.";
        } catch (Exception e) {
            // Handle exceptions appropriately in your Lambda function
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}
