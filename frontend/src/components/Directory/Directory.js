import React, { useState } from 'react';
import PropTypes from 'prop-types';

import IconButton from '../IconButton/IconButton';

import './Directory.css';
import chevRight from '../../assets/chevron-right.svg';
import chevDown from '../../assets/chevron-down.svg';


export default function Directory({ children, file, file_key, callbacks, style }) {
    const [expand, setExpand] = useState(false);

    // validate callbacks
    const handleClick = callbacks?.handleClick || function(){};
    const handleDoubleClick = callbacks?.handleDoubleClick || function(){};
    const handleCM = callbacks?.handleCM || function(){};
    

    return (
        <div>
            <button 
                className="Directory-button"
                onClick={ev => handleClick(ev, file_key)}
                onDoubleClick={ev => handleDoubleClick(ev, file_key)}
                onContextMenu={ev => handleCM(ev, file_key)}
                style={style}
            >
                <IconButton
                    src={expand ? chevDown : chevRight}
                    size="19px"
                    onClick={ev => {ev.stopPropagation(); setExpand(!expand);}}
                />
                <span>{file?.title}</span>
            </button>
            {expand && <div className="Directory-children">{children}</div>}
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