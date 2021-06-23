import {createContext} from 'react'

function ef() {}

export const AuthContext = createContext({
    token: null,
    role: null,
    userId: null,
    login: ef,
    logout: ef,
    isAuthenticated: false,
});