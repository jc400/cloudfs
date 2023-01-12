import React, { useState, useEffect, useRef } from 'react';
import getPositionStyle from '../../services/getPositionStyle';

import Menu from '../Menu/Menu';
import Button from '../Button/Button';

import './MenuDropdown.css';

export default function MenuDropdown({ children, title, tooltip }) {
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
            <Button
                onClick={toggle}
                tooltip={show ? '' : tooltip}
                style={show ? { backgroundColor: 'var(--gray1)' } : {}}
            >{title}</Button>
            {show &&
                <Menu style={style}>
                    {children}
                </Menu>
            }
        </div>
    )
}
