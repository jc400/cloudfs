import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Tooltip from '../Tooltip/Tooltip';

import './IconButton.css';

export default function IconButton({src, size, onClick, tooltip}){
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <button 
            className="IconButton"
            onClick={onClick} 
            onMouseEnter={()=>setShowTooltip(true)} 
            onMouseLeave={()=>setShowTooltip(false)}
        >
            <img src={src} width={size} />
            {tooltip && <Tooltip show={showTooltip} text={tooltip} />}
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
