package org.App.Utils.Interfaces;
import org.App.Utils.Network.Request;
import org.App.Utils.Network.Response;
public interface Middleware {
    boolean next(Request req,Response res);
}
