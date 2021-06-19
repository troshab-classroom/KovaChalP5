package org.App.Models;

import org.App.Utils.Utils.BaseModel;

public class Groups extends BaseModel<Groups>
{
    public String name;
    public static String table = "groups";
    //constructors
    public Groups(){}
    public Groups(int _id){super(_id);}

    //utility functions
    @Override
    public Groups getInstance(){
        return new Groups();
    }
    @Override
    public String getTable(){
        return table;
    }

}
