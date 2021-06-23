import React, {useContext, useEffect, useState} from 'react'
import "../tables.css"
import {Modal} from "../Modal";
import {useMessage} from "../../hooks/message.hook";
import {useHttp} from "../../hooks/http.hook";
import {ModalClientsCardsTable} from "./ModalsGroupTable";
import {AuthContext} from "../../context/AuthContext";
import {Loader} from "../Loader";
import {SortGroupTable} from "./SortGroupTable";
import {FilterGroupTable} from "./FilterGroupTable";

const TableRow = ({row, handleDataChange, rowToDelete, openDeletionConfirm}) => {
    const message = useMessage();
    const {loading, error, request, clearError} = useHttp();
    const [group, handleChangeGroup] = useState(row);
    const [edit, setEdit] = useState(false);
    const [backup, setBackup] = useState({});
    const {token} = useContext(AuthContext);

    useEffect(()=>{
        // handleChangeNumber(row.number);
        handleChangeGroup(row);
    }, [row]);

    const updateValues = e => {
        handleChangeGroup({...group, [e.target.name]:e.target.value});
    };

    const removeRow = () => {
        openDeletionConfirm(true);
        rowToDelete(group.id_group);
    };

    const editRow = () => {
        setEdit(true);
        setBackup(group);
    };

    useEffect(()=>{
        handleDataChange(
            group
        );
    }, [group, handleDataChange]);

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const confirmRow = async () =>{
        setEdit(false);
        const data = await request('Group/update', 'POST', group, {
            Authorization: "Bearer " + token
        });
        message(data.message);
    };

    const rejectRow = () =>{
        setEdit(false);
        handleChangeGroup(backup);
    };

    if(loading){
        return <Loader/>
    }

    return(
        <tr>
            <td>
                <input type="text" name="id_group" value={group.id_group}
                       disabled={true} onChange={updateValues}/>
            </td>
            <td>
                <input type="text" name="name" value={group.name}
                       disabled={!edit} minLength={"1"} maxLength={"50"}
                       onChange={(e) => {updateValues(e)}}/>
            </td>
            <td>
                <input type="text" name="description" value={group.description}
                       minLength={"1"} maxLength={"50"}
                       disabled={!edit} onChange={(e) => {updateValues(e)}}/>
            </td>
            <td>
                <input type="text" name="sum_total" value={group.sum_total}
                       minLength={"1"} maxLength={"50"}
                       disabled={true} onChange={(e) => {updateValues(e)}}/>
            </td>
            <td>
                <button type="button" className="btn btn-remove" onClick={removeRow}>
                    &times;
                </button>
                {!edit &&
                <button  type="button" className="btn btn-edit" onClick={editRow}>
                    Ред.
                </button>
                }
                {edit && <div>
                    <button  type="button" className="btn btn-edit" onClick={confirmRow}>
                        Save
                    </button>
                    <button  type="button" className="btn btn-edit" onClick={rejectRow}>
                        Back
                    </button>
                </div>
                }
            </td>
        </tr>
    )
};

export const GroupList = ({groups}) => {
    const message = useMessage();
    const {token} = useContext(AuthContext);
    const {loading, error, request, clearError} = useHttp();
    const [rowToDelete, setRowToDelete] = useState(undefined);
    const [isModalTableOpen, setIsModalTableOpen] = useState(false);
    const [isModalDeletionConfirmOpen, setIsModalDeletionConfirmOpen] = useState(false);
    const [rows, setRows] = useState(groups);
    const [isOrderTableOpen, setIsOrderTableOpen] = useState(false);
    const [isFilterTableOpen, setIsFilterTableOpen] = useState(false);
    // let tableRowIndex = categories.length-1;
    useEffect(() => {
        setRows(groups);
        // tableRowIndex=categories.length-1
    }, [setRows, groups]);

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    // const addNewRow = () => {
    //     tableRowIndex = parseFloat(tableRowIndex) + 1;
    //     let updatedRows = [...rows];
    //     updatedRows.push({number: "", name: ""});
    //     setRows(updatedRows)
    // };

    const deleteRow = async (number) => {
        setIsModalDeletionConfirmOpen(false);
        let updatedRows = [...rows];
        let indexToRemove = updatedRows.findIndex(x => x.number === number);
        if (indexToRemove > -1) {
            updatedRows.splice(indexToRemove, 1);
            setRows(updatedRows);
        }
        const data = await request('Group/delete', 'POST', {id: number}, {
            Authorization: "Bearer " + token
        });
        message(data.message);
    };

    const handleChange = data => {
        rows[rows.findIndex(x => x.id_group===data.id_group)] = data;
        setRows(rows);
    };

    if(loading){
        return <Loader/>
    }

    if (!groups.length){
        return <p className="center nothing">
            Нічого для відображення
        </p>
    }

    return (
        <div className={"container_m"}>
            <a className="add_button" onClick={() => setIsFilterTableOpen(true)}>
                Фільтрувати
            </a>
            <a className="add_button" onClick={() => setIsModalTableOpen(true)}>
                Додати
            </a>
            <a className="add_button" onClick={() => setIsOrderTableOpen(true)}>
                Упорядкувати
            </a>
            {isOrderTableOpen && (
                <Modal onClose={() => setIsOrderTableOpen(false)}>
                    <SortGroupTable setIsModalTableOpened={setIsOrderTableOpen} setData={setRows}/>
                </Modal>
            )}
            {isFilterTableOpen && (
                <Modal onClose={() => setIsFilterTableOpen(false)}>
                    <FilterGroupTable setIsModalTableOpened={setIsFilterTableOpen} setData={setRows}/>
                </Modal>
            )}
            {isModalTableOpen && (
                <Modal onClose={() => setIsModalTableOpen(false)}>
                    <ModalClientsCardsTable setIsModalTableOpened={setIsModalTableOpen}/>
                </Modal>
            )}
            {isModalDeletionConfirmOpen && (
                <Modal onClose={() => setIsModalDeletionConfirmOpen(false)}>
                    <p className="deletion_text">
                        Do you really want to delete the row?
                    </p>
                    <button className="btn" onClick={() => deleteRow(rowToDelete)}>
                        Yes
                    </button>
                    <button className="btn"
                            onClick={() => setIsModalDeletionConfirmOpen(false)}>
                        No
                    </button>
                </Modal>
            )}
            <table>
                <thead>
                <tr>
                    <th>
                        Номер
                    </th>
                    <th>
                        Назва
                    </th>
                    <th>
                        Опис
                    </th>
                    <th>
                        Загальна ціна
                    </th>
                    <th>
                        Action
                    </th>
                </tr>
                </thead>

                <tbody>
                {rows.map((group) => {
                    // if(group) {
                        return (
                            <TableRow row={group}
                                      handleDataChange={handleChange}
                                      rowToDelete={setRowToDelete}
                                      openDeletionConfirm={setIsModalDeletionConfirmOpen}/>
                        )
                    // }
                })}
                </tbody>
            </table>
        </div>
    )
};