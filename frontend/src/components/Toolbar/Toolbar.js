import React from 'react';
import './Toolbar.css';

export default function Toolbar({children, style}) {
    return (
        <div id="toolbar" style={style} >
            {children}
        </div>
    )
}