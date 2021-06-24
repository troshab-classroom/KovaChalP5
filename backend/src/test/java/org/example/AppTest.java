package org.example;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.App.Models.Products;
import org.App.Utils.Database;
import org.App.Utils.Interfaces.View;
import org.App.Utils.Network.Request;
import org.App.Utils.Network.Response;
import org.App.Utils.Utils.Session;
import org.App.http.Controllers.ProductController;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.junit.Before;
import org.junit.Test;

/**
 * Unit test for simple App.
 */
public class AppTest
{
    /**
     * Rigorous Test :-)
     */
    private class AssertationViewS implements View{
        public String response;
        AssertationViewS(String result){
            response=result;


        }
        @Override
        public void view(Response res) {


            assertEquals(res.data.toString(),response);
        }

    }
    private class AssertationView implements View{
        public JSONObject response;
        AssertationView(JSONObject result){
            response=result;

        }
        @Override
        public void view(Response res) {
            System.out.println(res.data);
            if(res.data.containsKey("price")){

                res.data.put("price",0);
                response.put("price",0);
            }

            assertEquals(res.data, response);
        }
    }
    @Before
    public void setUp() {
        Database.getConnection();

    }
    public Request generateR(String json,int id) throws ParseException {
        Request req = new Request(null);
        JSONParser parser = new JSONParser();
        JSONObject jsn = (JSONObject) parser.parse(json);
        req.session=new Session();
        req.data=jsn;
        req.session.data.put("{id}",Integer.toString(id));
        return req;
    }
    @Test
    public void post() throws ParseException {
        JSONObject data = new JSONObject();
        data.put("message","OK");
        View view = new AssertationView(data);
        ProductController.setView(view);
        Response res =new Response();
        res.data = new JSONObject();
        Request req = generateR("{\"amount\": \"10\", \"price\": \"100.00\", \"name\": \"dog\", \"description\": \"good\", \"producer\": \"dogger\", \"group\": \"1\"}",53);
        ProductController.post(req,res);
    }

    @Test
    public void putDelete() throws ParseException {
        JSONObject data = new JSONObject();
        data.put("message","OK");
        View view = new AssertationView(data);
        ProductController.setView(view);
        Response res =new Response();
        res.data = new JSONObject();

        Request req = generateR("{\"data\":[{\"amount\": \"10\", \"price\": \"100.00\", \"name\": \""+System.nanoTime()+"\", \"description\": \"good\", \"producer\": \"dogger\", \"group\": \"1\"}]}",53);

        ProductController.put(req,res);
    }
    @Test
    public void get() throws ParseException {
        JSONObject data = new JSONObject();
        data.put("amount",10);
        data.put("price",100.00);
        data.put("name","dog");
        data.put("description","good");
        data.put("producer","dogger");
        data.put("id",53);
        data.put("group",1);


        View view = new AssertationView(data);
        ProductController.setView(view);
        Response res =new Response();
        res.data = new JSONObject();

        Request req = generateR("{}",53);
        ProductController.get(req,res);
    }
    @Test
    public void filter() throws ParseException {
        //JSONObject data = new JSONObject();

        String data = "{\"data\":[{\"amount\":10,\"price\":100.00,\"name\":\"dog\",\"description\":\"good\",\"producer\":\"dogger\",\"id\":53,\"group\":1}]}";

        View view = new AssertationViewS(data);
        ProductController.setView(view);
        Response res =new Response();
        res.data = new JSONObject();

        Request req = generateR("{\"query\":\"`id` = '53'\"}",0);
        ProductController.getFiltered(req,res);

    }

}
