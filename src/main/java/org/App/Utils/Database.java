package org.App.Utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import org.App.Config;
public class Database {
    private static final String url = Config.url;
    private static final String user = Config.user;
    private static final String password = Config.password;
    static Connection con=null;
    public static Connection getConnection() {
        try {
            if(con!=null)return con;
            con = DriverManager.getConnection(url, user, password);
            return con;
        } catch(SQLException se) { System.out.println(se.getMessage());return null;}
    }
    public static ResultSet executeQuery(String query)  {
        try {
            Statement stmt = con.createStatement();
            if(stmt.execute(query))return stmt.getResultSet();
            //stmt.close();

            return null;
        } catch(SQLException se) { System.out.println(se.getMessage());return null;}
    }
    public static void close(){
        try {
            con.close();
            con=null;
        } catch (SQLException se){System.out.println(se.getMessage());}
    }

}

