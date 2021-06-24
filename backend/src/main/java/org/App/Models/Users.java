package org.App.Models;

import org.App.Utils.Utils.BaseModel;

public class Users extends BaseModel<Users> {
    public String username;
    public String pass;
    public static String table = "user";

    //constructors
    public Users(){}
    public Users(int _id){super(_id);}
    public Users(String _username,String _pass){
        pass=_pass;
        username=_username;
    }

    //utility functions
    @Override
    public Users getInstance(){
        return new Users();
    }
    @Override
    public String getTable(){
        return table;
    }
}
