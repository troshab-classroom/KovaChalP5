package org.App.Utils.Utils;

public class JSON {
    String json="{";
    public String stringify(){
        return json+"}";
    }
    public void set(String key,String value){
        json+="\""+key + "\":"+"\""+value+"\",";
    }
    public void set(String key,int value){
        json+="\""+key + "\":"+"\""+value+"\",";
    }
    public void set(String key,float value){
        json+="\""+key + "\":"+"\""+value+"\",";
    }
    public void set(String key,JSON value){
        json+="\""+key + "\":"+"\""+value.stringify()+"\",";
    }
}
