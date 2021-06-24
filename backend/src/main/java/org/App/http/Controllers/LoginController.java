package org.App.http.Controllers;

import org.App.Models.Users;
import org.App.Utils.Interfaces.View;
import org.App.Utils.JWT;
import org.App.Utils.Network.Request;
import org.App.Utils.Network.Response;
import org.App.http.Views.JsonView;

public class LoginController {
    public static View view = new JsonView();

    public static void setView(View view) {
        ProductController.view = view;
    }
    public static void login(Request req, Response res){
        try {
                String username = req.getString("username");
                String pass = req.getString("password");
                Users user = new Users().WHERE("'username'=" + username).get(0);
                if(user==null){
                    res.send(401,"no such user");
                    return;
                }
                if(!user.pass.equals(pass)){
                    res.send(401,"not authorized");
                    return;
                }
                res.data.put("token", JWT.createJWT(username));

                view.view(res);
        }catch(Exception ignored){ }
    }
}
