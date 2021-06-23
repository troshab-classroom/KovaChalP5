import React from 'react'
import {Link} from "react-router-dom";
import "./navbar.css"
import {ExitFromAccount} from "./ExitFromAccount";

export const Navbar = () => {
    return (
        <div className="navbar">
            <Link to="group">
                Групи товарів
            </Link>

            <Link to="product">
                Товари
            </Link>
            <div>
                <ExitFromAccount/>
            </div>
      </div>
  )
};