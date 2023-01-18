import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

export default function Button({children, onClick, deactivated, tooltip, style}){
    const className = deactivated ? "Button deactivated" : "Button";
    return (
        <button 
            title={tooltip}
            onClick={onClick}
            deactivated={deactivated.toString()}
            className={className}
            style={style}
        >
            {children}
        </button>
    )
}

Button.propTypes = {
    onClick: PropTypes.func,
    deactivated: PropTypes.bool, 
}
Button.defaultProps = {
    deactivated: false,
}