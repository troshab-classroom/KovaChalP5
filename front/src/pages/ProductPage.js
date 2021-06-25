import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {Loader} from "../components/Loader";
import {AuthContext} from "../context/AuthContext";
import {ProductList} from "../components/Product/ProductList";

export const ProductPage = () => {
    const [products, setProducts] = useState({data: []});
    const {loading} = useHttp();
    const {token} = useContext(AuthContext);

    // const getProducts = useCallback(async () => {
    //     try{
    //         const fetched = await request('http://localhost:8080/api/good/get/All', "GET", null, {
    //             Authorization: "Bearer " + token
    //         });
    //         setProducts(fetched);
    //     }catch (e) {}
    // }, [token, request]);
    //
    // useEffect(() => {
    //     getProducts();
    // }, [getProducts]);

    const getList = useCallback(() => {
        console.log(token);
        return fetch('http://localhost:8080/api/good/get/All',{
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "authentification": token.token,
            },
        }).then(data => data.json());
    }, [token]);

    useEffect(() => {
        let mounted = true;
        getList().then(items => {
            if(mounted) {
                setProducts(items);
            }
        });
        return () => mounted = false;
    }, [getList]);

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