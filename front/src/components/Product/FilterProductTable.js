import React, {useContext, useEffect, useState} from 'react'
import "../tables.css"
import {useMessage} from "../../hooks/message.hook";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";
import {Loader} from "../Loader";

const ModalTableRow = ({row, addRow, handleDataChange, deleteRow}) => {
    const [filter, handleChangeFilter] = useState(row);

    useEffect(()=>{
        handleChangeFilter(row);
    }, [row]);

    const updateValues = e => {
        if(e.target.name === "boolValue" && filter.boolValue === '' && (e.target.value === 'AND' || e.target.value === 'OR')){
            addRow();
        }
        else if (e.target.name === "boolValue"&& e.target.value === '' && (filter.boolValue === 'AND' || filter.boolValue === 'OR')){
            removeRow();
        }
        handleChangeFilter({...filter, [e.target.name]:e.target.value});
    };

    useEffect(()=>{
        handleDataChange(
            filter
        )
    }, [filter, handleDataChange]);

    const removeRow = () => {
        deleteRow(filter.id);
    };

    return(
        <tr>
            <td>
                <select name="column" onChange={updateValues}
                        value={filter.column} required>
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
            </td>
            <td>
                {(filter.column==="price" || filter.column==="amount") &&
                <select name="sign" onChange={updateValues}
                        value={filter.sign} required>
                        <option value="=">
                            &#61;
                        </option>
                        <option value="!=">
                            &ne;
                        </option>
                        <option value=">">
                            &gt;
                        </option>
                        <option value="<">
                            &lt;
                        </option>
                        <option value=">=">
                            &ge;
                        </option>
                        <option value="<=">
                            &le;
                        </option>
                    </select>}
                {(filter.column!=="price" && filter.column!=="amount") &&
                <select name="sign" onChange={updateValues}
                        value={filter.sign} required>
                    <option value="=">
                        &#61;
                    </option>
                    <option value="!=">
                        &ne;
                    </option>
                    <option value="LIKE">
                        LIKE
                    </option>
                    <option value="NOT LIKE">
                        NOT LIKE
                    </option>
                </select>}
            </td>
            <td>
                {(filter.column==="price" || filter.column==="amount") &&
                <input name="fieldValue" type="number" min={0} onChange={updateValues}
                       value={filter.fieldValue} required/> }
                {(filter.column!=="price" && filter.column!=="amount") &&
                <input name="fieldValue" type="text" onChange={updateValues}
                       value={filter.fieldValue} required/>}
            </td>
            <td>
                <select name="boolValue" onChange={updateValues} value={filter.boolValue}>
                    <option value="">

                    </option>
                    <option value="AND">
                        AND
                    </option>
                    <option value="OR">
                        OR
                    </option>
                </select>
            </td>
            {/*<td>*/}
            {/*    <button type="button" className="btn btn-remove" onClick={removeRow}>*/}
            {/*        &times;*/}
            {/*    </button>*/}
            {/*</td>*/}
        </tr>
    )
};
let tableRowIndex = 0;
export const FilterProductTable = ({setIsModalTableOpened, setData}) => {
    const message = useMessage();
    const {loading, error, clearError} = useHttp();
    const [modalRows, setModalRows] = useState([{
        id: 0,
        column: "name",
        sign: "=",
        fieldValue: "",
        boolValue: ""
    }]);
    const {token} = useContext(AuthContext);

    const addNewRow = () => {
        tableRowIndex = parseFloat(tableRowIndex) + 1;
        let updatedRows = [...modalRows];
        updatedRows.push({
            id: tableRowIndex,
            column: "name",
            sign: "=",
            fieldValue: "",
            boolValue: ""});
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

    const handleChange = async data => {
        modalRows[modalRows.findIndex(x => x.id===data.id)] = data;
        await setModalRows(modalRows);
    };

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const submit = async () => {
        try{
            let req = "";
            for (let i = 0; i < modalRows.length; ++i){
                req += "`" +  modalRows[i].column + "` " + modalRows[i].sign + " '" + modalRows[i].fieldValue + "' " + modalRows[i].boolValue
            }
            console.log(req);
            let mounted = true;
            getList(req).then(items => {
                if(mounted) {
                    console.log(items);
                    setData(items.data);
                }
            });
            return () => mounted = false;
        }catch (e) {}
        setIsModalTableOpened(false);// onClose = isModalTableIsOpen
    };

    function getList(req) {
        return fetch('http://localhost:8080/api/good/filter/By',{
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "authentification": token.token,
            },
            body: JSON.stringify({query: req})
        }).then(data => data.json())
    }

    if(loading){
        return <Loader/>
    }

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>
                        Поле
                    </th>
                    <th>
                        Знак
                    </th>
                    <th>
                        Значення
                    </th>
                    <th>
                        AND/OR
                    </th>
                </tr>
                </thead>
                <tbody>
                {modalRows.map((row, index) => {
                    // if(row) {
                        return (
                            <ModalTableRow key={index}
                                           row={row}
                                           addRow={addNewRow}
                                           deleteRow={deleteRow}
                                           handleDataChange={handleChange}/>
                        )
                    // }
                })}
                </tbody>
            </table>
            <button className="btn" onClick={submit}>
                Submit
            </button>
        </div>
    )
};