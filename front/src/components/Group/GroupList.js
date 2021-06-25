import React, {useCallback, useContext, useEffect, useState} from 'react'
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
    const [products, setProducts] = useState([{}]);
    const [totalSum, setTotalSum] = useState(0);

    useEffect(()=>{
        // handleChangeNumber(row.number);
        handleChangeGroup(row);
    }, [row]);

    const updateValues = e => {
        handleChangeGroup({...group, [e.target.name]:e.target.value});
    };

    const removeRow = () => {
        openDeletionConfirm(true);
        rowToDelete(group.id);
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
        const data = await request('https://localhost:8080/api/group/' + group.id, 'POST', group, {
            authentification: token.token
        });
        message(data.message);
    };

    const rejectRow = () =>{
        setEdit(false);
        handleChangeGroup(backup);
    };

    const getList = useCallback((req) => {
        return fetch('https://localhost:8080/api/good/filter/By',{
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "authentification": token.token
            },
            body: JSON.stringify({query: req})
        }).then(data => data.json())
    }, [token]);

    useEffect(() => {
        try{
            let req = "`group` = '" + group.id + "'";
            let mounted = true;
            getList(req).then(items => {
                if(mounted) {
                    console.log(items);
                    setProducts(items.data);
                }
            });
            return () => mounted = false;
        }catch (e) {}
    }, [getList, group]);

    useEffect(() => {
        console.log(products);
        let sum = 0;
        for(let i = 0; i < products.length; ++i){
            sum += Number.parseFloat(products[i].price) * Number.parseFloat(products[i].amount);
        }
        setTotalSum(sum);
        console.log(totalSum);
    }, [products]);

    if(loading){
        return <Loader/>
    }

    return(
        <tr>
            <td>
                <input type="text" name="id_group" value={group.id}
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
                <input type="number" name="sum_total" value={totalSum}
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
    const [rowToDelete, setRowToDelete] = useState(0);
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
	
	// useEffect(async () => {
	// 	console.log(await axios.get("https://localhost:8080/api/group/get/All"));
	// });

    // const addNewRow = () => {
    //     tableRowIndex = parseFloat(tableRowIndex) + 1;
    //     let updatedRows = [...rows];
    //     updatedRows.push({number: "", name: ""});
    //     setRows(updatedRows)
    // };

    const deleteRow = async (number) => {
        setIsModalDeletionConfirmOpen(false);
        let updatedRows = [...rows];
        let indexToRemove = updatedRows.findIndex(x => x.id === number);
        if (indexToRemove > -1) {
            updatedRows.splice(indexToRemove, 1);
            setRows(updatedRows);
            const data = await request('https://localhost:8080/api/group/' + number, 'DELETE', null, {
                authentification: token.token
            });
            message(data.message);
        }
    };

    const handleChange = data => {
        rows[rows.findIndex(x => x.id===data.id)] = data;
        setRows(rows);
    };

    if(loading){
        return <Loader/>
    }
    console.log(groups);
    if (!groups.length){
        return <p className="center nothing">
            Нічого для відображення
        </p>
    }

    return (
        <div className={"container_m"}>
            <button className="add_button" onClick={() => setIsFilterTableOpen(true)}>
                Фільтрувати
            </button>
            <button className="add_button" onClick={() => setIsModalTableOpen(true)}>
                Додати
            </button>
            <button className="add_button" onClick={() => setIsOrderTableOpen(true)}>
                Упорядкувати
            </button>
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
                {console.log(rows)}
                {rows.map((group, index) => {
                    // if(group) {
                        return (
                            <TableRow key={index}
                                      row={group}
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