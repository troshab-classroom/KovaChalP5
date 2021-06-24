package org.App.Models;
import org.App.Utils.Exceptions.InvalidDataException;
import org.App.Utils.Utils.BaseModel;
import java.math.BigDecimal;

public class Products extends BaseModel<Products> {
    public BigDecimal price;
    public String name;
    public int amount;
    public int group;
    public String description;
    public String producer;
    public static String table = "product_group";
    //constructors
    public Products(){ }
    public Products(BigDecimal _price,String _name,int _amount,int _group){price=_price;name=_name;amount=_amount; group=_group;}
    public Products(int id){
        super(id);
    }

    //utility functions
    @Override
    public Products getInstance(){
        return new Products();
    }
    @Override
    public String getTable(){
        return table;
    }
    @Override
    public boolean validate() throws InvalidDataException {
        if(price.signum() < 1 ||
                amount<0||
                group<0
        )throw new InvalidDataException("");
        return true;
    }

}
