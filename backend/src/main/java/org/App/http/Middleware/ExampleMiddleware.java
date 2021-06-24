package org.App.http.Middleware;

import org.App.Utils.Interfaces.Middleware;
import org.App.Utils.Network.Request;
import org.App.Utils.Network.Response;

public class ExampleMiddleware implements Middleware {
    @Override
    public boolean next(Request req, Response res) {
        return true;
    }
}
