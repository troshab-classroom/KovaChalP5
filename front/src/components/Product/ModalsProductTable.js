import React, {useContext, useEffect, useState} from 'react'
import "../tables.css"
import {useMessage} from "../../hooks/message.hook";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";
import {Loader} from "../Loader";

const ModalTableRow = ({row, handleDataChange, deleteRow}) => {
    const [product, handleChangeProduct] = useState(row);

    useEffect(()=>{
        handleChangeProduct(row);
    }, [row]);

    const updateValues = e => {
        handleChangeProduct({...product, [e.target.name]:e.target.value});
    };

    useEffect(()=>{
        handleDataChange(
            product
        )
    }, [product, handleDataChange]);

    const removeRow = () => {
        deleteRow(product.id);
    };

    return(
        <tr>
            <td>
                <input type="text" name="name" value={product.name}
                       minLength={"1"} maxLength={"50"}
                       onChange={(e) => {updateValues(e)}}/>
            </td>
            <td>
                <input type="text" name="description" value={product.description}
                       minLength={"1"} maxLength={"50"}
                       onChange={(e) => {updateValues(e)}}/>
            </td>
            <td>
                <input type="text" name="producer" value={product.producer}
                       minLength={"1"} maxLength={"50"}
                       onChange={(e) => {updateValues(e)}}/>
            </td>
            <td>
                <input type="number" name="amount" value={product.amount}
                       min={0} onChange={(e) => {updateValues(e)}}/>
            </td>
            <td>
                <input type="number" name="price" value={product.price}
                       min={0} onChange={(e) => {updateValues(e)}}/>
            </td>
            <td>
                <input type="number" name="group" value={product.group}
                       min={0} onChange={(e) => {updateValues(e)}}/>
            </td>
            <td>
                <button type="button" className="btn btn-remove" onClick={removeRow}>
                    &times;
                </button>
            </td>
        </tr>
    )
};

let tableRowIndex = 0;
export const ModalClientsCardsTable = ({setIsModalTableOpened}) => {
    const message = useMessage();
    const {loading, error, request, clearError} = useHttp();
    const [modalRows, setModalRows] = useState([{
        id: 0,
        name: "",
        description: "",
        producer: "",
        amount: 0,
        price: 0,
        group: 0
    }]);
    const {token} = useContext(AuthContext);

    const addNewRow = () => {
        tableRowIndex = parseFloat(tableRowIndex) + 1;
        let updatedRows = [...modalRows];
        updatedRows.push(
            {
                id: tableRowIndex,
                name: "",
                description: "",
                producer: "",
                amount: 0,
                price: 0,
                group: 0
            });
        setModalRows(updatedRows)
    };

    const deleteRow = (number) => {
        let updatedRows = [...modalRows];
        let indexToRemove = updatedRows.findIndex(x => x.id === number);
        if(indexToRemove > -1){
            updatedRows.splice(indexToRemove, 1);
            setModalRows(updatedRows);
        }
    };

    const handleChange = data => {
        modalRows[modalRows.findIndex(x => x.id===data.id)] = data;
        setModalRows(modalRows);
    };

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect(()=>{
        window.M.updateTextFields()
    }, []);

    const submit = async () => {
        for(let i = 0; i < modalRows.length; ++i){
            modalRows[i].price += '';
            modalRows[i].amount += '';
            modalRows[i].id += '';
            modalRows[i].group += '';
        }
        try{
            const data = await request('http://localhost:8080/api/good', 'PUT', {data: modalRows}, {
                authentification: token.token
            });
            message(data.message());
        }catch (e) {}
        setIsModalTableOpened(false);
    };

    if(loading){
        return <Loader/>
    }

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>
                        Назва
                    </th>
                    <th>
                        Опис
                    </th>
                    <th>
                        Виробник
                    </th>
                    <th>
                        Кількість на складі
                    </th>
                    <th>
                        Ціна за одиницю
                    </th>
                    <th>
                        Група товарів
                    </th>
                    <th>
                        Action
                    </th>
                </tr>
                </thead>
                <tbody>
                {modalRows.map((row) => {
                    // if(row) {
                        return (
                            <ModalTableRow row={row}
                                           deleteRow={deleteRow}
                                           handleDataChange={handleChange}/>
                        )
                    // }
                })}
                </tbody>
            </table>
            <button className="btn" onClick={addNewRow}>
                Add new record
            </button>
            <button className="btn" onClick={submit}>
                Submit
            </button>
        </div>
    )
};