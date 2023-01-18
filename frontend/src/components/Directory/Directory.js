import React, { useState } from 'react';
import PropTypes from 'prop-types';

import IconButton from '../IconButton/IconButton';

import './Directory.css';
import chevRight from '../../assets/chevron-right.svg';
import chevDown from '../../assets/chevron-down.svg';


export default function Directory({ children, file, file_key, callbacks, style }) {
    const [expand, setExpand] = useState(false);

    const handleClick = () => {
        setExpand(!expand);
        callbacks.select(file_key);
    }

    return (
        <div>
            <div 
                className="Directory"
                onClick={handleClick}
                onContextMenu={ev => callbacks.openContextMenu(ev, file_key)}
                style={style}
            >
                <IconButton
                    src={expand ? chevDown : chevRight}
                    size="19px"
                />
                <span>{file?.title}</span>
            </div>
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