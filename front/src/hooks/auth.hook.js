import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData';

export const useAuth = () => {
    const [role, setRole] = useState(null);
    const [ready, setReady] = useState(false);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    const login = useCallback((jwtToken, user_role, id) => {
        setRole(user_role);
        setUserId(id);
        setToken(jwtToken);

        localStorage.setItem(storageName, JSON.stringify({
            userId: id, role: user_role, token: jwtToken
        }));
    }, []);

    const logout = useCallback(() => {
        setRole(null);
        setUserId(null);
        setToken(null);
        localStorage.removeItem(storageName)
    }, []);

    useEffect(() => {
       const data = JSON.parse(localStorage.getItem(storageName));

       if (data && data.token && data.role){
           login(data.token, data.role, data.userId);
       }
       setReady(true);
    }, [login]);

    return {token, login, logout, role, userId, ready}
};