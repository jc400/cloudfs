import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '../IconButton/IconButton';

import './File.css';
import FileIcon from '../../assets/file.svg';


export default function File({ file, file_key, callbacks, style }) {

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
            <IconButton src={FileIcon} size="14px" />
            &nbsp;
            <span>{file?.title}</span>
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