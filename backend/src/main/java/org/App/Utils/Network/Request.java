package org.App.Utils.Network;

import org.App.Utils.Utils.Console;
import org.App.Utils.Utils.Session;
import com.sun.net.httpserver.HttpExchange;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;

public class Request {
    public String url;
    public Session session;
    public HttpExchange httpExchange;
    public JSONObject data;
    Request(){}
    public Request(HttpExchange he){
        System.out.println(3);
        try {
            httpExchange = he;
            if (he.getRequestMethod().equals("GET")) return;
            System.out.println(he.getRequestMethod());
            JSONParser jr = new JSONParser();
            data = (JSONObject) jr.parse(new InputStreamReader(he.getRequestBody(), StandardCharsets.UTF_8));
        }catch(Exception e){
            System.out.println(4);
            Console.dev(e.toString());
        }

    }
    public int getInt(String key){
        return Integer.parseInt((String)data.get(key));
    }
    public String getString(String key){
        return (String) data.get(key);
    }
    public BigDecimal getBigDecimal(String key){
        return new BigDecimal((String) data.get(key));
    }

}
