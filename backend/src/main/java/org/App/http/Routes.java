package org.App.http;

import org.App.Utils.Interfaces.Middleware;
import org.App.Utils.Router;
import org.App.http.Controllers.ExampleController;
import org.App.http.Controllers.GroupController;
import org.App.http.Controllers.LoginController;
import org.App.http.Controllers.ProductController;
import org.App.http.Middleware.AuthMiddleware;

public class Routes {
    public static void run(){
        Router.post("/api/login", LoginController::login);
        Router.post("/api/exampleController", ExampleController::handle);
        //Router.group(new Middleware[]{new AuthMiddleware()});
        {
            Router.get("/api/good/{id}", ProductController::get);
            Router.get("/api/good/get/All", ProductController::getAll);
            Router.post("/api/good/{id}", ProductController::post);
            Router.post("/api/good/filter/By", ProductController::getFiltered);
            Router.put("/api/good", ProductController::put);
            Router.delete("/api/good/{id}", ProductController::delete);

            Router.get("/api/group/{id}", GroupController::get);
            Router.get("/api/group/get/All", GroupController::getAll);
            Router.post("/api/group/{id}", GroupController::post);
            Router.post("/api/group/filter/By", GroupController::getFiltered);
            Router.put("/api/group", GroupController::put);
            Router.delete("/api/group/{id}", GroupController::delete);
        }
    }
}
