import React from 'react';
import PropTypes from 'prop-types';

import './File.css';


export default function File({ file, file_key, callbacks, style }) {

    // validate callbacks
    const handleClick = callbacks?.handleClick || function(){};
    const handleDoubleClick = callbacks?.handleDoubleClick || function(){};
    const handleCM = callbacks?.handleCM || function(){};
    

    return (
        <button 
            className="File"
            onClick={ev => handleClick(ev, file_key)}
            onDoubleClick={ev => handleDoubleClick(ev, file_key)}
            onContextMenu={ev => handleCM(ev, file_key)}
            style={style}
        >{file?.title}</button>
    )
}

File.propTypes = {
    file: PropTypes.object,
    columns: PropTypes.object,
}
File.defaultProps = {
    columns: {name: true, size: true, updated: true, starred: true},
}