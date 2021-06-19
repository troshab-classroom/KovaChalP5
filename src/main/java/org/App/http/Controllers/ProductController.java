package org.App.http.Controllers;

import org.App.Models.Products;
import org.App.Utils.Exceptions.InvalidDataException;
import org.App.Utils.Exceptions.NoSuchIdException;
import org.App.Utils.Interfaces.View;
import org.App.Utils.Network.Request;
import org.App.Utils.Network.Response;
import org.App.http.Views.JsonView;

public class ProductController {
    public static View view = new JsonView();

    public static void setView(View view) {
        ProductController.view = view;
    }
    public static void post(Request req, Response res){
        try{
            int id = req.session.getInt("{id}");
            Products products = new Products(id).FETCH();
            products.price = req.getBigDecimal("price");
            products.name  = req.getString("name");
            products.amount= req.getInt("amount");
            products.group = req.getInt("group");
            products.UPDATE();
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
            Products products = new Products();
            products.price = req.getBigDecimal("price");
            products.name  = req.getString("name");
            products.amount= req.getInt("amount");
            products.group = req.getInt("group");
            products.INSERT();
            res.data.put("id",products.getId());
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
            res.send(204, "No suchID");
        }
        catch (Exception e){
            res.send(500, "Not OK");
        }
    }
}
