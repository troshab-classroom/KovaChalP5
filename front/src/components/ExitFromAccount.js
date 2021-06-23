import React, {useContext} from 'react'
import {useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

export const ExitFromAccount = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);

    const logoutHandler = event => {
        event.preventDefault();
        auth.logout();
        history.push('/')
    };

    return (
        <div className="right">
            <a className="button-7_2" href="/" onClick={logoutHandler}>
                <span>
                    Вийти
                </span>
            </a>
        </div>
    )
};