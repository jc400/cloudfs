import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './Button.css';
import Tooltip from '../Tooltip/Tooltip';

export default function Button({children, onClick, deactivated, tooltip, style}){
    const [showTooltip, setShowTooltip] = useState(false);
    const className = deactivated ? "Button deactivated" : "Button";
    return (
        <button 
            onClick={onClick} 
            onMouseEnter={()=>setShowTooltip(true)} 
            onMouseLeave={()=>setShowTooltip(false)}
            deactivated={deactivated.toString()}
            className={className}
            style={style}
        >
            {children}
            {tooltip && <Tooltip show={showTooltip} text={tooltip} />}
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