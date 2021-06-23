import React, {useContext, useEffect, useState} from 'react'
import "../tables.css"
import {useMessage} from "../../hooks/message.hook";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";
import {Loader} from "../Loader";

export const SortProductTable = ({setData, setIsModalTableOpened}) => {
    const message = useMessage();
    const {loading, error, request, clearError} = useHttp();
    const [modalRows, setModalRows] = useState({
        column: "name",
        method: "ASC",
    });
    const {token} = useContext(AuthContext);

    const handleChange = e => {
        setModalRows({...modalRows, [e.target.name]:e.target.value});
    };

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const submit = async () => {
        try{
            // фільтрація на порожні рядки
            // modalRows.map((mRow) => {
            //
            // })
            const data = await request('Product/getSortedBy?column=' + modalRows.column + '&method=' + modalRows.method,
                'GET', null, {
                Authorization: "Bearer " + token
            });
            setData(data);
            // message(data.message());
        }catch (e) {}
        setIsModalTableOpened(false);// onClose = isModalTableIsOpen
    };

    if(loading){
        return <Loader/>
    }
    return (
        <div>
            <div className={"sorterModal"}>
                <select name="column" onChange={handleChange}>
                    <option value="name">
                        Назва
                    </option>
                    <option value="description">
                        Опис
                    </option>
                    <option value="producer">
                        Виробник
                    </option>
                    <option value="amount">
                        Кількість на складі
                    </option>
                    <option value="price">
                        Ціна за одиницю
                    </option>
                </select>
                <select name="method" onChange={handleChange}>
                    <option value="ASC">
                        ASC
                    </option>
                    <option value="DESC">
                        DESC
                    </option>
                </select>
            </div>
            <button className="btn" onClick={submit}>
                Submit
            </button>
        </div>
    )
};