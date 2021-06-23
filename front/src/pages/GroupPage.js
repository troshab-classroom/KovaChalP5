import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {Loader} from "../components/Loader";
import {AuthContext} from "../context/AuthContext";
import {GroupList} from "../components/Group/GroupList";

export const GroupPage = () => {
    const [groups, setGroups] = useState([]);
    const {loading, request} = useHttp();
    const {token} = useContext(AuthContext);

    const getClientsCards = useCallback(async () => {
        try{
            const fetched = await request('Group/getAll', "GET", null, {
                Authorization: "Bearer " + token
            });
            setGroups(fetched);
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
            {!loading && <GroupList groups={[{id_group: 10, name: "AAA", description: "BBB", sum_total: 123456557}]} /*groups={groups}*//>}
        </>
    )
};