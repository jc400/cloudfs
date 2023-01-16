import React from 'react';

import './ScrollArea.css';


export default function ScrollArea({ children, bgColor }) {
    // requires a parent with a set height (like min height 100%) and a background color
    return (
        <div className="scroll-area" style={{ "--bg": bgColor }}>
            {children}
        </div>
    )
}