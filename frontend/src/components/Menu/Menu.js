import React from 'react';
import './Menu.css';

export default function Menu({children, style}){
    return (
        <div className="Menu" style={style}>
            {children}
        </div>
    )
}