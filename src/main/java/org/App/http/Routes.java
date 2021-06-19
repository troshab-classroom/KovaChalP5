package org.App.http;

import org.App.Utils.Interfaces.Middleware;
import org.App.Utils.Router;
import org.App.http.Controllers.ExampleController;
import org.App.http.Controllers.LoginController;
import org.App.http.Controllers.ProductController;
import org.App.http.Middleware.AuthMiddleware;

public class Routes {
    public static void run(){
        Router.post("/api/login", LoginController::login);

        Router.group(new Middleware[]{new AuthMiddleware()});
        {
            Router.post("/api/exampleController", ExampleController::handle);
            Router.get("/api/good/{id}", ProductController::get);
            Router.post("/api/good/{id}", ProductController::post);
            Router.put("/api/good", ProductController::put);
            Router.delete("/api/good/{id}", ProductController::delete);
        }
    }
}
