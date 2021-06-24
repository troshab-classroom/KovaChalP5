import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {Loader} from "../components/Loader";
import {AuthContext} from "../context/AuthContext";
import {GroupList} from "../components/Group/GroupList";

export const GroupPage = () => {
    const [groups, setGroups] = useState({data: [{}]});
    const {loading} = useHttp();
    const {token} = useContext(AuthContext);

    /*const getGroup = () => {
        try{
            request('http://localhost:8080/api/group/get/All', "GET", null, {
                Authorization: "Bearer " + token
            }).then((fetched) => {return fetched});
            // console.log(fetched);
            // // setGroups(fetched);
            // console.log(groups);
        }catch (e) {}
    };

    useEffect(() => {
        getGroup().then((fetched) => {console.log(fetched)});
    });*/
	function getList() {
		return fetch('http://localhost:8080/api/group/get/All',{
			method: "GET",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				"authentification": token.token,
			},
		}).then(data => data.json());
	}

	useEffect(() => {
	   let mounted = true;
	   getList().then(items => {
		   if(mounted) {
			 setGroups(items);
		   }
		 });
	   return () => mounted = false;
	   }, []);

    if (loading){
        return <Loader/>
    }

    return (
        <>
            {console.log(groups)}
            {console.log(groups.data)}
            {!loading && <GroupList
                // groups={[{id_group: 10, name: "AAA", description: "BBB", sum_total: 123456557}]}
                groups={groups.data}/>}
        </>
    )
};