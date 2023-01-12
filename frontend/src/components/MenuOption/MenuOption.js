import React from 'react';
import PropTypes from 'prop-types';
import './MenuOption.css';

export default function MenuOption({name, onClick, style}){
    return (
        <button onClick={onClick} className="MenuOption" style={style}>
            {name}
        </button>
    )
}

MenuOption.propTypes = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    style: PropTypes.object,
}