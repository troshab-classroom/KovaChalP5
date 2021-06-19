package org.App.Utils.Utils;
import org.App.Config;
public class Console {
    public static int ERROR=1;
    public static int INFO=2;
    public static int WARNING=3;
    public static int DEBUG=4;
    public static int DEV=5;
    public static int SILENCE=0;

    public static void log(String txt){
        System.out.println(txt);
    }
    public static void info(String txt){
        if(Config.mode<INFO)return;
        System.out.println(txt);
    }
    public static void warning(String txt){
        if(Config.mode<WARNING)return;
        System.out.println(txt);
    }
    public static void debug(String txt){
        if(Config.mode<DEBUG)return;
        System.out.println(txt);
    }
    public static void dev(String txt){
        if(Config.mode<DEV)return;
        System.out.println(txt);
    }
    public static void error(String txt){
        if(Config.mode<ERROR)return;
        System.out.println(txt);
    }

}
