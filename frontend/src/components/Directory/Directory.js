import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './Directory.css';
import chevRight from '../../assets/chevron-right.svg';
import chevDown from '../../assets/chevron-down.svg';


export default function Directory({ children, file, file_key, callbacks, columns, style }) {
    const [expand, setExpand] = useState(true);

    // validate callbacks
    const handleClick = callbacks?.handleClick || function(){};
    const handleDoubleClick = callbacks?.handleDoubleClick || function(){};
    const handleCM = callbacks?.handleCM || function(){};
    

    return (
        <div>
            <div 
                className="Directory"
                onClick={ev => handleClick(ev, file_key)}
                onDoubleClick={ev => handleDoubleClick(ev, file_key)}
                onContextMenu={ev => handleCM(ev, file_key)}
                style={style}
            >
                    <span>
                        <button onClick={() => setExpand(!expand)}>
                            <img 
                                src={expand ? chevDown : chevRight} 
                                width="15px" 
                                height="15px" 
                                style={{marginRight: "7px"}} 
                            />
                        </button>
                        <span>{file?.title}</span>
                    </span>
            </div>
            {expand && <div style={{marginLeft: 20}}>{children}</div>}
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