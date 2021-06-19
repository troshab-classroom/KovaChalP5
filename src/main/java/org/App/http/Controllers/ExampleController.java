package org.App.http.Controllers;

import org.App.Utils.Network.Request;
import org.App.Utils.Network.Response;

public class ExampleController {
    public static void handle(Request req , Response res){
        try {
            res.send(200, "Hello");
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
