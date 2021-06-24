import {createContext} from 'react'

function ef() {}

export const AuthContext = createContext({
    token: null,
    login: ef,
    logout: ef,
    isAuthenticated: false,
});