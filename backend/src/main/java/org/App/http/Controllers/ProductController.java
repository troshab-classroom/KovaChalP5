package org.App.http.Controllers;


import org.App.Models.Products;
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

public class ProductController {
    public static View view = new JsonView();

    public static void setView(View view) {
        ProductController.view = view;
    }
    public static void post(Request req, Response res){
        try{
            int id = req.session.getInt("{id}");
            System.out.println(id);
            Products products = new Products(id).FETCH();

            products.price = req.getBigDecimal("price");
            System.out.println(1213123123);
            products.name  = req.getString("name");
            products.amount= req.getInt("amount");
            products.group = req.getInt("group");
            products.description = req.getString("description");
            products.producer = req.getString("producer");
            System.out.println(1213123123);
            products.UPDATE();
            res.data.put("message","OK");
            res.code=200;
            view.view(res);
        }catch (NoSuchIdException e){
            res.data.put("message","Id error");
            res.code=202;
            view.view(res);
        }
        catch (InvalidDataException e){

            res.data.put("message","data error");
            res.code=504;
            view.view(res);
        }
        catch (Exception e){
            System.out.println(e);
            res.send(500, "Not OK");
        }
    }
    public static void put(Request req, Response res){
        try {
            Products products = new Products();
            JSONArray arr = (JSONArray)req.data.get("data");
            for(Object obj:arr) {
                req = new Request(req.httpExchange);
                req.data = (JSONObject)obj;
                products.price = req.getBigDecimal("price");
                products.name = req.getString("name");
                products.amount = req.getInt("amount");
                products.group = req.getInt("group");
                products.description = req.getString("description");
                products.producer = req.getString("producer");
                products.INSERT();
                //
            }
            res.data.put("message", "OK");
            res.code=200;
            view.view(res);
        } catch (InvalidDataException e) {
            res.send(409, "Bad data");
        }


    }
    public static void get(Request req, Response res){

        try {
            int id = req.session.getInt("{id}");
            Products products = new Products(id).FETCH();
            res.data.put("name",products.name);
            res.data.put("price",products.price);
            res.data.put("group",products.group);
            res.data.put("amount",products.amount);
            res.data.put("description",products.description);
            res.data.put("producer",products.producer);
            res.data.put("id",products.getId());
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
            Products products = new Products(id).FETCH();
            products.DELETE();
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
        ArrayList<Products> products = new Products().GET();

        JSONArray jarr = new JSONArray();
        for(Products product:products){
            JSONObject productJsonified = new JSONObject();
            productJsonified.put("name",product.name);
            productJsonified.put("price",product.price);
            productJsonified.put("amount",product.amount);
            productJsonified.put("group",product.group);
            productJsonified.put("description",product.description);
            productJsonified.put("producer",product.producer);
            productJsonified.put("id",product.getId());
            jarr.add(productJsonified);
        }
        res.data.put("data",jarr);
        view.view(res);

    }
    public static void getFiltered(Request req, Response res){
        try {
            ArrayList<Products> products = new Products().WHERE(req.getString("query"));

            JSONArray jarr = new JSONArray();
            for (Products product : products) {
                JSONObject productJsonified = new JSONObject();
                productJsonified.put("name", product.name);
                productJsonified.put("price", product.price);
                productJsonified.put("amount",product.amount);
                productJsonified.put("group", product.group);
                productJsonified.put("description", product.description);
                productJsonified.put("producer",product.producer);
                productJsonified.put("id", product.getId());
                jarr.add(productJsonified);
            }
            res.data.put("data", jarr);
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
