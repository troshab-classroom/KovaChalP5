package org.App.Utils;

import org.App.Config;
import com.sun.net.httpserver.HttpServer;
import org.App.http.Routes;

import java.io.IOException;
import java.net.InetSocketAddress;


public class App {
    public static int HTTP_PORT = Config.PORT;
    public static HttpServer server;
    public static void run() throws IOException {
        server = HttpServer.create();
        server.bind(new InetSocketAddress(HTTP_PORT),0);
        Router.setHttpServer(server);


        Routes.run();
        Database.getConnection();
        server.start();

    }
    public static void return404(){

    }
}
