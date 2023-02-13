import React from 'react';
import './Icon.css';

export default function Icon({src, size}){
    return (
        <img 
            src={src} 
            width={size} 
            alt=""
            className="Icon"
        />
    )
}