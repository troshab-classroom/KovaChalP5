package org.App.Utils.Interfaces;
import org.App.Utils.Exceptions.InvalidDataException;
import org.App.Utils.Exceptions.NoSuchIdException;

import java.sql.SQLException;
import java.util.ArrayList;
public interface Model<T> {
    Model getInstance();
    String getTable();
    void INSERT() throws InvalidDataException;
    void DELETE() throws NoSuchIdException;
    void UPDATE() throws IllegalAccessException, InvalidDataException;
    T FETCH() throws NoSuchIdException, SQLException, IllegalAccessException;
    void setID(int id);
    boolean validate() throws InvalidDataException;
    ArrayList<T> GET();
    ArrayList<T> WHERE(String expression) throws SQLException, IllegalAccessException;
}
