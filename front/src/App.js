import React from "react"
import {useRoutes} from "./routes";
import {BrowserRouter as Router} from "react-router-dom";
import 'materialize-css'
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";
import {Loader} from "./components/Loader";
import {ModalProvider} from "./components/Modal";
import {Navbar} from "./components/Navbar";

function App() {
    const {token, login, logout, ready} = useAuth();
    const isAuthenticated = !!token;
    const routes = useRoutes(isAuthenticated);

    if (!ready){
        return <Loader/>
    }

    return (
        <AuthContext.Provider value={{token, login, logout, isAuthenticated}}>
            <ModalProvider>
                <Router>
                    {isAuthenticated && <Navbar/>}
                    <div>
                        {routes}
                    </div>
                </Router>
            </ModalProvider>
        </AuthContext.Provider>
    );
}

export default App;