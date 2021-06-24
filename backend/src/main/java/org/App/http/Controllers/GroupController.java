package org.App.http.Controllers;
import org.App.Models.Groups;
import org.App.Utils.Exceptions.InvalidDataException;
import org.App.Utils.Exceptions.NoSuchIdException;
import org.App.Utils.Interfaces.View;
import org.App.Utils.Network.Request;
import org.App.Utils.Network.Response;
import org.App.http.Views.JsonView;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.sql.SQLException;
import java.util.ArrayList;

public class GroupController {
    public static View view = new JsonView();

    public static void setView(View view) {
        GroupController.view = view;
    }
    public static void post(Request req, Response res){
        try{
            int id = req.session.getInt("{id}");
            Groups Groups = new Groups(id).FETCH();
            Groups.name  = req.getString("name");
            Groups.description = req.getString("description");
            Groups.UPDATE();
            res.data.put("message","OK");
            res.code=200;
            view.view(res);
        }catch (NoSuchIdException e){
            res.send(204, "No suchID");
        }
        catch (InvalidDataException e){
            res.send(409, "Bad data");
        }
        catch (Exception e){
            res.send(500, "Not OK");
        }
    }
    public static void put(Request req, Response res){
        try {
            Groups Groups = new Groups();
            JSONArray arr = (JSONArray)req.data.get("data");
            System.out.println(arr.get(0));
            for(Object obj:arr) {
                System.out.println("aaa");
                req = new Request(req.httpExchange);
                req.data = (JSONObject) obj;
                Groups.name = req.getString("name");
                Groups.description = req.getString("description");
                System.out.println(Groups.description + " " + Groups.name);
                Groups.INSERT();
            }
            res.data.put("message","OK");
            res.code=200;
            view.view(res);
        } catch (InvalidDataException e) {
            res.send(409, "Bad data");
        }


    }
    public static void get(Request req, Response res){

        try {
            int id = req.session.getInt("{id}");
            Groups Groups = new Groups(id).FETCH();
            res.data.put("name",Groups.name);
            res.data.put("description",Groups.description);
            res.data.put("id",Groups.getId());
            res.code=200;
            view.view(res);
        }catch(NoSuchIdException e){
            res.send(204, "No suchID");
        }
        catch (Exception e){
            res.send(500, "Not OK");
        }
    }
    public static void delete(Request req, Response res){
        try {
            int id = req.session.getInt("{id}");
            Groups Groups = new Groups(id).FETCH();
            Groups.DELETE();
            res.data.put("message","OK");
            res.code=200;
            view.view(res);
        }catch(NoSuchIdException e){
            res.data.put("message","NO ID");
            res.code=204;
            view.view(res);
        }
        catch (Exception e){
            res.data.put("message","Backend errored");
            res.code=500;
            view.view(res);
        }
    }
    public static void getAll(Request req, Response res){
        System.out.println("1");
        ArrayList<Groups> Groups = new Groups().GET();

        JSONArray jarr = new JSONArray();
        for(Groups product:Groups){
            JSONObject productJsonified = new JSONObject();
            productJsonified.put("name",product.name);
            productJsonified.put("description",product.description);
            productJsonified.put("id",product.getId());
            jarr.add(productJsonified);
        }
        res.data.put("data",jarr);
        System.out.println("2");
        view.view(res);

    }
    public static void getFiltered(Request req, Response res){
        try {
            System.out.println(10);
            ArrayList<Groups> Groups = new Groups().WHERE(req.getString("query"));

            JSONArray jarr = new JSONArray();
            for (Groups product : Groups) {
                JSONObject productJsonified = new JSONObject();
                productJsonified.put("name", product.name);
                productJsonified.put("description", product.description);
                productJsonified.put("id", product.getId());
                jarr.add(productJsonified);
            }
            res.data.put("data", jarr);
            System.out.println(res.data);
            view.view(res);
        }catch (SQLException e){
            System.out.println(e);
            res.send(500,"database error");
        }catch (Exception e){
            System.out.println(e);
            res.send(500,"backend error");
        }
    }
}

