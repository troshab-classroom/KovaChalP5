import React, {useState, useEffect, useContext} from 'react'
import "./signIn.css"
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const {loading, error, clearError} = useHttp();
    const [form, setForm] = useState({
        username: '',
        password: ''
    });

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value});
    };

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect(()=>{
        window.M.updateTextFields()
    }, []);

    // const loginHandler = async () => {
    //     try{
    //         const data = await request('http://localhost:8080/api/login', 'POST', {...form});
    //         console.log(data.token);
    //         auth.login(data.token);
    //         message(data.message());
    //     }catch (e) {}
    // };

    function getList() {
        return fetch('http://localhost:8080/api/login',{
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({...form})
        }).then(data => data.json())
    }

    const loginHandler = () => {
        let mounted = true;
        getList().then(items => {
            if(mounted) {
                auth.login(items);
            }
        });
        return () => mounted = false;
    };

    // const registerHandler = async () => {
    //     try{
    //         const data = await request('api/registration', 'POST', {...form});
    //         auth.login(data.token, data.userId);
    //         message(data.message());
    //     }catch (e) {}
    // };

    return (
        <div className="center">
            <div className="container">
                <label htmlFor="show" className="close-btn fas fa-times" title="close"/>
                <div className="text">
                    Login
                </div>
                <form action="#">
                    <div className="data">
                        <label htmlFor="email">Login</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Введіть логін"
                            value={form.email}
                            onChange={changeHandler}
                            required />
                    </div>
                    <div className="data">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Введіть пароль"
                            value={form.password}
                            onChange={changeHandler}
                            required />
                    </div>
                    <button className="s_btn" aria-disabled={loading} onClick={loginHandler}>
                        Login
                    </button>
                    {/*<input type="submit" className="s_btn" aria-disabled={loading} onClick={registerHandler} value={"Sign up"}/>*/}
                    {/*<div className="signup-link">
                        Not a registered? <a href="signUp.html">Sign up now</a></div>*/}
                </form>
            </div>
        </div>
    )
};