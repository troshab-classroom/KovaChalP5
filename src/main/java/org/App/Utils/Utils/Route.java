package org.App.Utils.Utils;
import org.App.Utils.Interfaces.Middleware;
import org.App.Utils.Network.Request;
import org.App.Utils.Network.Response;

import java.util.ArrayList;
import java.util.Collections;

public class Route {


    public interface Handler{
        void Handle(Request req, Response res);
    }
    public Handler controller;
    public ArrayList<Middleware> middlewares = new ArrayList<>();
    public Route(Handler _controller){
        controller=_controller;
    }
    public void middleware(Middleware[] _middlewares){
        Collections.addAll(middlewares, _middlewares);
    }
    public void middleware(ArrayList<Middleware> _middlewares){
        middlewares.addAll(_middlewares);
    }
}
