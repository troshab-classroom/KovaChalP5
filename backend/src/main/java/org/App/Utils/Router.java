package org.App.Utils;

import org.App.Utils.Interfaces.Middleware;
import org.App.Utils.Network.Request;
import org.App.Utils.Network.Response;
import org.App.Utils.Utils.Route;
import org.App.Utils.Utils.Route.Handler;
import org.App.Utils.Utils.Session;
import org.App.Utils.Utils.URLParser;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
public class Router {
    private static HashMap<String, Route> routes = new HashMap<>();
    private static HttpServer httpServer;
    private static ArrayList<Middleware> group = new ArrayList<>();
    public static void setHttpServer(HttpServer httpServer) {
        Router.httpServer = httpServer;
    }
    public static void group(Middleware[] middlewares){
        Collections.addAll(group, middlewares);
    }
    public static void regroup(Middleware[] middlewares){
        group = new ArrayList<>();
        Collections.addAll(group, middlewares);
    }

    protected static void Handle(HttpExchange httpExchange){
        if(httpExchange.getRequestMethod()=="OPTIONS"){
            httpExchange.getResponseHeaders().set("Access-Control-Allow-Credentials","true");
            try {
                httpExchange.sendResponseHeaders(200, 0);
            }catch(Exception e){}
            return;
        }
        String uri = httpExchange.getRequestURI().getPath();
        String method = httpExchange.getRequestMethod();
        Request req = new Request(httpExchange);
        Response res= new Response(httpExchange);
        push(method+" "+uri,req,res);
    }
    public static Route post(String route,Handler handler){
        httpServer.createContext(route,Router::Handle);
        URLParser.addSchema(route);
        routes.put("POST "+route,new Route((Route.Handler) handler));
        routes.get("POST "+route).middleware(group);
        return routes.get("POST "+route);
    }
    public static Route put(String route,Handler handler){
        httpServer.createContext(route,Router::Handle);
        URLParser.addSchema(route);
        routes.put("PUT "+route,new Route((Route.Handler) handler));
        routes.get("PUT "+route).middleware(group);
        return routes.get("PUT "+route);
    }
    public static Route get(String route,Handler handler){

        URLParser.addSchema(route);
        httpServer.createContext(route,Router::Handle);
        routes.put("GET "+route,new Route((Route.Handler) handler));
        routes.get("GET "+route).middleware(group);
        return routes.get("GET "+route);
    }
    public static Route delete(String route,Handler handler){
        httpServer.createContext(route,Router::Handle);
        URLParser.addSchema(route);
        routes.put("DELETE "+route,new Route((Route.Handler) handler));
        routes.get("DELETE "+route).middleware(group);
        return routes.get("DELETE "+route);
    }
    protected static boolean push(String routeUrl,Request req,Response res){

        Session session = new Session();


        Route route=routes.get(routeUrl.split(" ")[0]+" "+URLParser.getSchema(routeUrl,session));

        if(route==null)App.return404();
        req.session=session;

        for(Middleware middleware : route.middlewares){
            if(!middleware.next(req,res))return false;
        }

        route.controller.Handle(req,res);
        return false;
    }
}
