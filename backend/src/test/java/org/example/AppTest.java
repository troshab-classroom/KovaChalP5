package org.example;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.App.Models.Products;
import org.App.Utils.Interfaces.View;
import org.App.Utils.Network.Request;
import org.App.Utils.Network.Response;
import org.App.http.Controllers.ProductController;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.junit.Test;

/**
 * Unit test for simple App.
 */
public class AppTest
{
    /**
     * Rigorous Test :-)
     */
    private class AssertationView implements View{
        public JSONObject response;
        AssertationView(JSONObject result){
            response=result;

        }
        @Override
        public void view(Response res) {
            assertEquals(res.data.toJSONString(), response.toJSONString());
        }
    }

    public Request generateR(String json,int id) throws ParseException {
        Request req = new Request(null);
        JSONParser parser = new JSONParser();
        JSONObject jsn = (JSONObject) parser.parse(json);
        req.data=jsn;
        req.session.data.put("{id}",Integer.toString(id));
        return req;
    }
    @Test
    public void post() {
        JSONObject data = new JSONObject();
        View view = new AssertationView(data);
        ProductController::setView(view);
        ProductController::post();
    }

}
