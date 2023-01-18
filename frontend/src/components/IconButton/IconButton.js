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
            <img src={src} width={size} />
        </button>
    )
}

IconButton.propTypes = {
    onClick: PropTypes.func,
    size: PropTypes.string,
}
IconButton.defaultProps = {
    size: "25px",
}
