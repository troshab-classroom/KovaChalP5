import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthPage} from "./pages/AuthPage";
import {GroupPage} from "./pages/GroupPage";
import {ProductPage} from "./pages/ProductPage";

export const useRoutes = (isAuthenticated) => {
    // return (
    //     <Switch>
    //         <Route path="/main" exact>
    //             <ManagerPage/>
    //         </Route>
    //         <Route path="/" exact>
    //             <AuthPage/>
    //         </Route>
    //         <Redirect to="/"/>
    //     </Switch>
    // );
    console.log(isAuthenticated);
    // if (isAuthenticated){
        return(
            <Switch>

                <Route path="/product" exact>
                    <ProductPage/>
                </Route>
                <Route path="/group" exact>
                    <GroupPage/>
                </Route>
                <Redirect to="/main"/>

            </Switch>
        )
    // }
    // return (
    //     <Switch>
    //         <Route path="/" exact>
    //             <AuthPage/>
    //         </Route>
    //         <Redirect to="/"/>
    //     </Switch>
    // )
};
