import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {Loader} from "../components/Loader";
import {AuthContext} from "../context/AuthContext";
import {ProductList} from "../components/Product/ProductList";

export const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const {loading, request} = useHttp();
    const {token} = useContext(AuthContext);

    const getClientsCards = useCallback(async () => {
        try{
            const fetched = await request('api/good/get/All', "GET", null, {
                Authorization: "Bearer " + token
            });
            setProducts(fetched);
        }catch (e) {}
    }, [token, request]);

    useEffect(() => {
        getClientsCards();
    }, [getClientsCards]);

    if (loading){
        return <Loader/>
    }

    return (
        <>
            {!loading && <ProductList
                // products={[{id_product: 123, name: "AAA",
                //     description:"BBB", producer: "CCC", amount: 100,
                //     price: 1020}]}
                products={products.data}/>}
        </>
    )
};