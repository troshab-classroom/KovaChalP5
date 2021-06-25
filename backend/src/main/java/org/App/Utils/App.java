package org.App.Utils;

import com.sun.net.httpserver.HttpsConfigurator;
import com.sun.net.httpserver.HttpsParameters;
import com.sun.net.httpserver.HttpsServer;
import org.App.Config;
import com.sun.net.httpserver.HttpServer;
import org.App.http.Routes;

import javax.net.ssl.*;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.security.*;
import java.security.cert.CertificateException;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;


public class App {
    public static int HTTP_PORT = Config.PORT;
    public static HttpsServer server;
    public static void run() throws IOException, NoSuchAlgorithmException, KeyManagementException, KeyStoreException, UnrecoverableKeyException, CertificateException {
        //server = HttpServer.create();
        //
        //InetSocketAddress address = new InetSocketAddress(InetAddress.getLocalHost(), 8080);

        // Initialise the HTTPS server
        HttpsServer httpsServer = HttpsServer.create();
        httpsServer.bind(new InetSocketAddress(HTTP_PORT),0);
        SSLContext sslContext = SSLContext.getInstance("TLS");

        // Initialise the keystore
        char[] password = "pass_for_self_signed_cert".toCharArray();
        KeyStore ks = KeyStore.getInstance("JKS");
        FileInputStream fis = new FileInputStream("C:\\Program Files\\Java\\jdk-16.0.1\\bin\\keystore.jks");
        ks.load(fis, password);

        // Set up the key manager factory
        KeyManagerFactory kmf = KeyManagerFactory.getInstance("SunX509");
        kmf.init(ks, password);

        // Set up the trust manager factory
        TrustManagerFactory tmf = TrustManagerFactory.getInstance("SunX509");
        tmf.init(ks);

        // Set up the HTTPS context and parameters
        sslContext.init(kmf.getKeyManagers(), tmf.getTrustManagers(), null);
        httpsServer.setHttpsConfigurator(new HttpsConfigurator(sslContext) {
            public void configure(HttpsParameters params) {
                try {
                    // Initialise the SSL context
                    SSLContext c = SSLContext.getDefault();
                    SSLEngine engine = c.createSSLEngine();
                    params.setNeedClientAuth(false);
                    params.setCipherSuites(engine.getEnabledCipherSuites());
                    params.setProtocols(engine.getEnabledProtocols());

                    // Get the default parameters
                    SSLParameters defaultSSLParameters = c.getDefaultSSLParameters();
                    params.setSSLParameters(defaultSSLParameters);
                } catch (Exception ex) {
                    System.out.println(ex);
                }
            }
        });
        server = httpsServer;
        System.out.println(server);
        Router.setHttpsServer(server);


        Routes.run();
        Database.getConnection();
        server.setExecutor(new ThreadPoolExecutor(4, 8, 30, TimeUnit.SECONDS, new ArrayBlockingQueue<Runnable>(100)));
        server.start();

    }
    public static void return404(){

    }
}
