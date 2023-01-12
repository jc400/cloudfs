import React from 'react';
import './Sidebar.css';

export default function Sidebar({show, children}) {
    return (
        <>
            {show && (
                <div id="sidebar">
                    {children}
                </div>
            )}
        </>
    )
}