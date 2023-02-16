import React from 'react';
import PropTypes from 'prop-types';

import './IconButton.css';

export default function IconButton({src, size, onClick, tooltip}){

    return (
        <button 
            title={tooltip}
            className="IconButton"
            onClick={onClick} 
        >
            <img src={src} width={size} alt=""/>
        </button>
    )
}

IconButton.propTypes = {
    src: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    size: PropTypes.string,
    tooltip: PropTypes.string
}
IconButton.defaultProps = {
    size: "25px",
    tooltip: "",
}
