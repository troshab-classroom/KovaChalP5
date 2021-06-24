import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData';

export const useAuth = () => {
    const [ready, setReady] = useState(false);
    const [token, setToken] = useState(null);

    const login = useCallback((jwtToken) => {
        setToken(jwtToken);

        localStorage.setItem(storageName, JSON.stringify({
            token: jwtToken
        }));
        console.log(jwtToken);
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        localStorage.removeItem(storageName)
    }, []);

    useEffect(() => {
       const data = JSON.parse(localStorage.getItem(storageName));

       if (data && data.token){
           login(data.token);
       }
       setReady(true);
    }, [login]);

    return {token, login, logout, ready}
};