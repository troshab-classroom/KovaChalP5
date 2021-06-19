package org.App.Utils.Network;

import org.App.Utils.Utils.Console;
import com.sun.net.httpserver.HttpExchange;
import org.json.simple.JSONObject;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;

public class Response {
    public HttpExchange httpExchange;
    public JSONObject data;
    public int code;
    public Response(){}
    public Response(HttpExchange he){
        httpExchange=he;
        data = new JSONObject();
    }
    public void send(int code,String data){
        try {
            httpExchange.sendResponseHeaders(code, data.getBytes(StandardCharsets.UTF_8).length);
            httpExchange.getResponseBody().write(data.getBytes(StandardCharsets.UTF_8));
            httpExchange.getResponseBody().flush();
            httpExchange.getResponseBody().close();
        }catch (Exception e){
            Console.error(e.toString());
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
