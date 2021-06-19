package org.App.http.Views;

import org.App.Utils.Interfaces.View;
import org.App.Utils.Network.Response;

public class JsonView implements View {
    public JsonView(){ }
    @Override
    public void view(Response res) {
        res.httpExchange.getResponseHeaders().set("Content-Type", "application/json");
        res.send(res.code,res.data.toString());
    }
}
