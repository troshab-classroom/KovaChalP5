import React, {useContext, useEffect, useState} from 'react'
import "../tables.css"
import {Modal} from "../Modal";
import {useMessage} from "../../hooks/message.hook";
import {useHttp} from "../../hooks/http.hook";
import {ModalClientsCardsTable} from "./ModalsProductTable";
import {AuthContext} from "../../context/AuthContext";
import {Loader} from "../Loader";
import {SortProductTable} from "./SortProductTable";
import {FilterProductTable} from "./FilterProductTable";

const TableRow = ({row, handleDataChange, rowToDelete, openDeletionConfirm,
                      openAddProduct, openRemoveProduct, setProductName}) => {
    const message = useMessage();
    const {loading, error, request, clearError} = useHttp();
    const [product, handleChangeProduct] = useState(row);
    const [edit, setEdit] = useState(false);
    const [backup, setBackup] = useState({});
    const {token} = useContext(AuthContext);

    useEffect(()=>{
        // handleChangeNumber(row.number);
        handleChangeProduct(row);
    }, [row]);

    const updateValues = e => {
        handleChangeProduct({...product, [e.target.name]:e.target.value});
    };

    const removeRow = () => {
        openDeletionConfirm(true);
        rowToDelete(product.id);
    };

    const addProduct = () => {
        setProductName(product.name);
        openAddProduct(true);
    };

    const removeProduct = () => {
        setProductName(product.name);
        openRemoveProduct(true);
    };

    const editRow = () => {
        setEdit(true);
        setBackup(product);
    };

    useEffect(()=>{
        handleDataChange(
            product
        );
    }, [product, handleDataChange]);

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const confirmRow = async () =>{
        setEdit(false);
        product.price += '';
        product.amount += '';
        product.id += '';
        product.group += '';
        const data = await request('https://localhost:8080/api/good/' + product.id, 'POST', product, {
            authentification: token.token
        });
        message(data.message);
    };

    const rejectRow = () =>{
        setEdit(false);
        handleChangeProduct(backup);
    };

    if(loading){
        return <Loader/>
    }

    return(
        <tr>
            <td>
                <input type="text" name="id_product" value={product.id}
                       disabled={true} onChange={updateValues}/>
            </td>
            <td>
                <input type="text" name="name" value={product.name}
                       disabled={!edit} minLength={"1"} maxLength={"50"}
                       onChange={(e) => {updateValues(e)}}/>
            </td>
            <td>
                <input type="text" name="description" value={product.description}
                       minLength={"1"} maxLength={"50"}
                       disabled={!edit} onChange={(e) => {updateValues(e)}}/>
            </td>
            <td>
                <input type="text" name="producer" value={product.producer}
                       minLength={"1"} maxLength={"50"}
                       disabled={!edit} onChange={(e) => {updateValues(e)}}/>
            </td>
            <td>
                <input type="number" name="amount" value={product.amount}
                        min={0} disabled={!edit}
                       onChange={(e) => {updateValues(e)}}/>
            </td>
            <td>
                <input type="number" name="price" value={product.price}
                       min={0} disabled={!edit}
                       onChange={(e) => {updateValues(e)}}/>
            </td>
            <td>
                <input type="number" name="total_price" value={product.price * product.amount}
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
                <button  type="button" className="btn btn-edit" onClick={addProduct}>
                    +
                </button>
                <button  type="button" className="btn btn-edit" onClick={removeProduct}>
                    -
                </button>
            </td>
        </tr>
    )
};

export const ProductList = ({products}) => {
    const message = useMessage();
    const {token} = useContext(AuthContext);
    const {loading, error, request, clearError} = useHttp();
    const [rowToDelete, setRowToDelete] = useState(undefined);
    const [isModalTableOpen, setIsModalTableOpen] = useState(false);
    const [isModalDeletionConfirmOpen, setIsModalDeletionConfirmOpen] = useState(false);
    const [rows, setRows] = useState(products);
    const [isOrderTableOpen, setIsOrderTableOpen] = useState(false);
    const [isFilterTableOpen, setIsFilterTableOpen] = useState(false);
    const [isAddProductTableOpen, setIsAddProductTableOpen] = useState(false);
    const [isRemoveProductTableOpen, setIsRemoveProductTableOpen] = useState(false);
    const [productName, setProductName] = useState(undefined);
    const [amountToAddRemove, setAmountToAddRemove] = useState(0);
    // let tableRowIndex = categories.length-1;
    useEffect(() => {
        setRows(products);
        // tableRowIndex=categories.length-1
    }, [setRows, products]);

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
        let indexToRemove = updatedRows.findIndex(x => x.id === number);
        if (indexToRemove > -1) {
            updatedRows.splice(indexToRemove, 1);
            setRows(updatedRows);
            const data = await request('https://localhost:8080/api/good/' + number, 'DELETE', null, {
                authentification: token.token
            });
            message(data.message);
        }
    };

    const handleChange = data => {
        rows[rows.findIndex(x => x.id===data.id)] = data;
        setRows(rows);
    };

    const handleAddRemoveChange = (e) => {
        setAmountToAddRemove(e.target.value);
    };

    const removeProductSubmit = async () => {
        const data = await request('api/good/removeProd', 'POST', {name: productName, amount:amountToAddRemove}, {
            Authorization: "Bearer " + token
        });
        message(data.message);
        setIsRemoveProductTableOpen(false);
    };

    const addProductSubmit = async () => {
        const data = await request('api/good/addProd', 'POST', {name: productName, amount:amountToAddRemove}, {
            Authorization: "Bearer " + token
        });
        message(data.message);
        setIsAddProductTableOpen(false);
    };

    if(loading){
        return <Loader/>
    }

    if (!products.length){
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
                    <SortProductTable setIsModalTableOpened={setIsOrderTableOpen} setData={setRows}/>
                </Modal>
            )}
            {isFilterTableOpen && (
                <Modal onClose={() => setIsFilterTableOpen(false)}>
                    <FilterProductTable setIsModalTableOpened={setIsFilterTableOpen} setData={setRows}/>
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
            {isAddProductTableOpen && (
                <Modal onClose={() => setIsAddProductTableOpen(false)}>
                    <form>
                        {productName}
                        <input name={"amount"} type={"number"} min={0} onChange={handleAddRemoveChange}/>
                        <input type={"submit"} className={"btn"} onClick={addProductSubmit} value={"Submit"}/>
                    </form>
                </Modal>
            )}
            {isRemoveProductTableOpen && (
                <Modal onClose={() => setIsRemoveProductTableOpen(false)}>
                    <form>
                        {productName}
                        <input name={"amount"} type={"number"} min={0} onChange={handleAddRemoveChange}/>
                        <input type={"submit"} className={"btn"} onClick={removeProductSubmit} value={"Submit"}/>
                    </form>
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
                        Виробник
                    </th>
                    <th>
                        Кількість на складі
                    </th>
                    <th>
                        Ціна за одиницю
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
                {rows.map((product) => {
                    // if(product) {
                        return (
                            <TableRow setProductName={setProductName}
                                      openAddProduct={setIsAddProductTableOpen}
                                      openRemoveProduct={setIsRemoveProductTableOpen}
                                      row={product}
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