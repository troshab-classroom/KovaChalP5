package org.App.Utils.Utils;
import org.App.Utils.Database;
import org.App.Utils.Exceptions.InvalidDataException;
import org.App.Utils.Exceptions.NoSuchIdException;
import org.App.Utils.Interfaces.Model;

import java.lang.reflect.Field;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class  BaseModel<T extends Model<T>> implements Model<T>{

    public static String  table;
    protected int id;
    protected BaseModel(){ }
    protected BaseModel(int _id){
        id=_id;
    }



    @Override
    public boolean validate()throws InvalidDataException {
        return true;
    }
    @Override
    public Model getInstance(){
        return new BaseModel();
    }
    @Override
    public String getTable(){
        return table;
    }
    @Override
    public void DELETE() throws NoSuchIdException {

        if(id==0){
            throw new NoSuchIdException("");
        }

        ResultSet rs = Database.executeQuery("DELETE FROM "+getTable()+" WHERE id = "+id);
    }
    @Override
    public void UPDATE() throws InvalidDataException {
        validate();
        try {
            String sql = "UPDATE " + getTable() + " SET ";

            for (Field f : getClass().getDeclaredFields()) {
                if (f.getName().equals("table")) continue;
                sql += "`" + f.getName() + "`" + "='" + f.get(this) + "',";
            }
            sql = sql.substring(0, sql.length() - 1);
            sql += " WHERE id='" + id + "'";
            ResultSet rs = Database.executeQuery(sql);
        }catch (IllegalAccessException ignored){}

    }

    @Override
    public void INSERT() throws InvalidDataException {
        validate();
        try{
            String sql = "INSERT INTO "+getTable()+" (`";
            String part2= ") VALUES ('";
            for(Field f: getClass().getDeclaredFields()){
                if(f.getName().equals("table"))continue;
                sql += f.getName()+"`,`";
                part2+=f.get(this)+"','";
            }
            sql=sql.substring(0, sql.length() - 2);
            part2=part2.substring(0, part2.length() - 2);
            sql+= (part2+");");
            System.out.println(sql);
            Database.executeQuery(sql);
            ResultSet rs = Database.executeQuery("SELECT MAX(id) FROM "+getTable());
            rs.next();

            int r = rs.getInt(1);
            setID(r);


        }catch (Exception e){System.out.println(e);}
    }
    public void setID(int _id){
        id=_id;
    }
    public int getId(){
        return id;
    }
    public ArrayList<T> GET(){
        try {
            ArrayList<T> arr = new ArrayList<T>();
            ResultSet rs = Database.executeQuery("SELECT * FROM " + getTable());
            //System.out.println(rs.toString());
            while (rs.next()) {
                int i =1;
                T obj = (T)getInstance();
                obj.setID(rs.getInt(i));
                i++;
                for (Field f : obj.getClass().getDeclaredFields()) {
                    if(f.getName().equals("table"))continue;
                    switch (f.getType().getSimpleName()) {
                        case "String":
                            f.set(obj, rs.getString(i));
                            break;
                        case "int":
                            f.set(obj, rs.getInt(i));
                            break;
                        case "float":
                            f.set(obj, rs.getFloat(i));
                            break;
                        case "BigDecimal":
                            f.set(obj, rs.getBigDecimal(i));
                            break;
                    }

                    i++;
                }

                arr.add(obj);
            }

            return arr;
        }catch(Exception e){
            System.out.println(e.toString());
            return null;
        }
    }
    public ArrayList<T> WHERE(String expression) throws SQLException{
        try {
            ArrayList<T> arr = new ArrayList<T>();
            ResultSet rs = Database.executeQuery("SELECT * FROM " + getTable() + " WHERE " + expression);
            //System.out.println(rs.toString());
            while (rs.next()) {
                int i = 1;
                T obj = (T) getInstance();
                obj.setID(rs.getInt(i));
                i++;
                for (Field f : obj.getClass().getDeclaredFields()) {
                    if (f.getName().equals("table")) continue;
                    switch (f.getType().getSimpleName()) {
                        case "String":
                            f.set(obj, rs.getString(i));
                            break;
                        case "int":
                            f.set(obj, rs.getInt(i));
                            break;
                        case "float":
                            f.set(obj, rs.getFloat(i));
                            break;
                        case "BigDecimal":
                            f.set(obj, rs.getBigDecimal(i));
                            break;
                    }

                    i++;
                }

                arr.add(obj);
            }
            return arr;
        }catch(IllegalAccessException e){return null;}


    }
    @Override
    public T FETCH() throws NoSuchIdException{
        try{
            ArrayList<T> arr = WHERE("id="+id);
            if(arr.size()==0)throw new NoSuchIdException(""+id);
            return arr.get(0);
        }catch (SQLException e){
            return null;
        }
    }
    @Override
    public String toString() {
        try {
            String str = "{";
            str+="id="+id+"\n";
            for (Field f : getClass().getDeclaredFields()) {
                str += f.getName() + "=" + f.get(this) + ",\n";
            }
            return str + "}\n";
        }catch(Exception e) {
            return "e";
        }
    }
}

