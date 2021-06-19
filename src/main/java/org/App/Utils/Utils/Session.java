package org.App.Utils.Utils;

import java.math.BigDecimal;
import java.util.HashMap;

public class Session {

    public String token;
    public String user;
    public HashMap<String,String> data = new HashMap<>();
    public Session(){}

    public void save(String key,String val){
        data.put(key,val);
    }
    public int getInt(String key){
        return Integer.parseInt(data.get(key));
    }
    public String getString(String key){
        return data.get(key);
    }
    public BigDecimal getBigDecimal(String key){
        return new BigDecimal(data.get(key));
    }


}
