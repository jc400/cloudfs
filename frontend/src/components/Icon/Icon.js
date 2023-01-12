import React from 'react';
import './Icon.css';

export default function Icon({src}){
    return (
        <img 
            className="Icon"
            src={src}
            width="25px"
        />
    )
}