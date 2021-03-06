import React from 'react'
import "./loader.css"

export const Loader = () => {
    return(
        <div className="loader">
            <div className="spinner-layer spinner-red">
                <div className="circle-clipper left">
                    <div className="circle"/>
                </div>
                <div className="gap-patch">
                    <div className="circle"/>
                </div>
                <div className="circle-clipper right">
                    <div className="circle"/>
                </div>
            </div>
        </div>
    )
};