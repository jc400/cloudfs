import React, { useState, useEffect, useRef } from 'react';
import getPositionStyle from '../../services/getPositionStyle';

import Menu from '../Menu/Menu';
import IconButton from '../IconButton/IconButton';

import './MenuDropdown.css';

export default function MenuDropdown({ children, icon, tooltip }) {
    const [show, setShow] = useState(false);
    const [style, setStyle] = useState({});
    const dropdownRef = useRef();

    const open = () => {
        const x = dropdownRef.current.getBoundingClientRect().x;
        const y = dropdownRef.current.getBoundingClientRect().y;
        setStyle(getPositionStyle(x, y));
        setShow(true);
    }
    const close = () => {
        setShow(false);
    }
    const toggle = (ev) => {
        ev.stopPropagation();   // prevents click from immediately closing dropdown
        if (show) {close()}
        else {open()}
    }

    useEffect(() => {
        if (show) {
            window.addEventListener("click", close)
        }
        return () => window.removeEventListener("click", close);
    }, [show]);


    return (
        <div className="MenuDropdown" ref={dropdownRef}>
            <IconButton
                src={icon}
                onClick={toggle}
                tooltip={tooltip}
                style={show ? { backgroundColor: 'var(--bg1)' } : {}}
            />
            {show &&
                <Menu style={style}>
                    {children}
                </Menu>
            }
        </div>
    )
}
