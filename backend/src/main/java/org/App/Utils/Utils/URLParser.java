package org.App.Utils.Utils;

import java.util.ArrayList;

public class URLParser {
    public static ArrayList<String> urlSchemas=new ArrayList<>();
    public static String getSchema(String url, Session session){

        url=url.split(" ")[1];
        for(String str : urlSchemas){
            System.out.println(str+" "+url);

            if(compare(url,str,session)){

                return str;
            };
        }
        return "err";
    }
    private static boolean compare(String url,String schema,Session s){

        String[] urlArr = url.split("/");
        String[] schemaArr = schema.split("/");


        if(urlArr.length!=schemaArr.length)return false;

        for(int i =1;i<urlArr.length;i++){

            if (schemaArr[i].charAt(0)=='{'){

                s.save(schemaArr[i],urlArr[i]);
                //System.out.println(urlArr[i]+" "+schemaArr[i].charAt(0));
                continue;
            }

            if(!schemaArr[i].equals(urlArr[i]))return false;
        }
//        System.out.println(11);
        return true;

    }
    public static void addSchema(String str){
        urlSchemas.add(str);
        System.out.println(urlSchemas);
    }
}
