import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import './File.css';
import fileIcon from '../../assets/file.svg';


export default function File({ file, file_key, callbacks, columns, style }) {

    // validate callbacks
    const handleClick = callbacks?.handleClick || function(){};
    const handleDoubleClick = callbacks?.handleDoubleClick || function(){};
    const handleCM = callbacks?.handleCM || function(){};
    

    return (
        <div 
            className="File"
            onClick={ev => handleClick(ev, file_key)}
            onDoubleClick={ev => handleDoubleClick(ev, file_key)}
            onContextMenu={ev => handleCM(ev, file_key)}
            style={style}
        >
                <span>
                    <img src={fileIcon} width="15px" height="15px" style={{marginRight: "7px"}} />
                    <span>{file?.title}</span>
                </span>
        </div>
    )
}

File.propTypes = {
    file: PropTypes.object,
    columns: PropTypes.object,
}
File.defaultProps = {
    columns: {name: true, size: true, updated: true, starred: true},
}