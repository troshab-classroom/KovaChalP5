package org.App.http.Middleware;

import org.App.Utils.Interfaces.Middleware;
import org.App.Utils.JWT;
import org.App.Utils.Network.Request;
import org.App.Utils.Network.Response;

public class AuthMiddleware implements Middleware {
    @Override
    public boolean next(Request req, Response res) {
//        System.out.println(req.httpExchange.getRequestHeaders().get("authentification"));
//        System.out.println(req.httpExchange.getRequestHeaders().get("authentification").get(0));
        boolean token = JWT.verify(req.httpExchange.getRequestHeaders().get("authentification").get(0));
        if(!token) {
            res.send(403, "NOT AUTHORIZED");
            return false;
        }
        return true;
    }
}
