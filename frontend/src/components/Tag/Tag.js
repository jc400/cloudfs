import React from 'react';
import IconButton from '../IconButton/IconButton';
import './Tag.css';
import CloseIcon from '../../assets/x.svg';


export default function Tag({ name, onClick, remove }) {
    return (
        <div className="tag" onClick={onClick}>
            <span>{name}</span>
            {remove &&
                <IconButton
                    src={CloseIcon}
                    size={"15px"}
                    onClick={ev => { ev.stopPropagation(); remove() }}
                />
            }
        </div>
    )
}