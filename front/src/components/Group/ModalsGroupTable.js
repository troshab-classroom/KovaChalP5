import React, {useContext, useEffect, useState} from 'react'
import "../tables.css"
import {useMessage} from "../../hooks/message.hook";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";
import {Loader} from "../Loader";

const ModalTableRow = ({row, handleDataChange, deleteRow}) => {
    const [group, handleChangeCard] = useState(row);

    useEffect(()=>{
        handleChangeCard(row);
    }, [row]);

    const updateValues = e => {
        handleChangeCard({...group, [e.target.name]:e.target.value});
    };

    useEffect(()=>{
        handleDataChange(
            group
        )
    }, [group, handleDataChange]);

    const removeRow = () => {
        deleteRow(group.id);
    };

    return(
        <tr>
            <td>
                <input type="text" name="name" value={group.name}
                       maxLength={"50"} minLength={"1"}
                       onChange={(e) => {updateValues(e)}}/>
            </td>
            <td>
                <input type="text" name="description" value={group.description}
                       maxLength={"50"} minLength={"1"}
                       onChange={(e) => {updateValues(e)}}/>
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
        try{
            const data = await request('http://localhost:8080/api/group', 'PUT', {data: modalRows}, {
                authentification: token.token
            });
            message(data.message());
        }catch (e) {}
        setIsModalTableOpened();
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